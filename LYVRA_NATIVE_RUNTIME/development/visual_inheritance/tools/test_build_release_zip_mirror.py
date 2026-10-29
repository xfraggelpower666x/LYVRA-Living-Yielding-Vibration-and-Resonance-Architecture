#!/usr/bin/env python3
"""Offline R05 ZIP builder regression tests using synthetic, non-production payloads.

This file creates NO repository changes, publishes NO plugins, and never
contacts a browser/provider. Execute locally alongside build_release_zip_mirror.py.
"""
import hashlib
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest
import zipfile

from build_release_zip_mirror import ASSETS

class MirrorTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = pathlib.Path(self.tmp.name)/"source"
        self.output = pathlib.Path(self.tmp.name)/"out"
        self.root.mkdir()
        self.version = "99.1.2"
        self.plugin_id = "plugins_test"
        self.release_id = "pluginrel_test"
        self.target = "native"
        interface = {"logo":"./assets/lyvra-plugin-logo.png"}
        manifest = {"name":"lyvra-native-runtime","version":self.version,"extensions":{"com.openai":{"interface":interface}}}
        for name in ["plugin.json",".codex-plugin/plugin.json"]:
            self.put(name, json.dumps(manifest).encode())
        for i,name in enumerate(ASSETS["native"]):
            self.put(name, ("original-"+str(i)).encode())

    def put(self, name, content):
        p=self.root/name
        p.parent.mkdir(parents=True,exist_ok=True)
        p.write_bytes(content)

    def build(self, extra=None):
        cmd=[sys.executable,str(pathlib.Path(__file__).with_name("build_release_zip_mirror.py")),
             "--source",str(self.root),"--target",self.target,
             "--plugin-id",self.plugin_id,"--version",self.version,
             "--release-id",self.release_id,"--output-dir",str(self.output)]
        if extra: cmd+=extra
        return subprocess.run(cmd,capture_output=True,text=True,check=False)

    def test_deterministic_zip_and_byte_readback(self):
        a=self.build()
        self.assertEqual(a.returncode,0,a.stderr)
        report=json.loads(a.stdout)
        zip_path=pathlib.Path(report["zip"])
        first=hashlib.sha256(zip_path.read_bytes()).hexdigest()
        with zipfile.ZipFile(zip_path) as z:
            self.assertEqual(z.read("assets/lyvra-original-visuals/LYVRA_Heart_Logo.jpeg"),b"original-1")
        b=self.build()
        self.assertEqual(b.returncode,0,b.stderr)
        self.assertEqual(hashlib.sha256(zip_path.read_bytes()).hexdigest(),first)
        receipt=json.loads(pathlib.Path(report["receipt"]).read_text())
        self.assertEqual(receipt["zip_sha256"],first)
        self.assertEqual(receipt["source_provenance"],"SOURCE_SNAPSHOT_ONLY")
        self.assertEqual(receipt["host_render"],"NOT_TESTED")
        self.assertFalse(report["current_release_mirror_verified"])

    def test_missing_approved_original_rejected(self):
        (self.root/"assets/lyvra-plugin-logo.png").unlink()
        v=self.build()
        self.assertNotEqual(v.returncode,0)
        self.assertIn("required file missing",v.stderr)

    def test_manifest_version_drift_rejected(self):
        p=self.root/"plugin.json"
        j=json.loads(p.read_text())
        j["version"]="98.0.0"
        p.write_text(json.dumps(j))
        v=self.build()
        self.assertNotEqual(v.returncode,0)
        self.assertIn("manifest version mismatch",v.stderr)

    def test_manifest_logo_role_drift_rejected(self):
        p=self.root/"plugin.json"
        j=json.loads(p.read_text())
        j["extensions"]["com.openai"]["interface"]["logo"]="./assets/other.png"
        p.write_text(json.dumps(j))
        v=self.build()
        self.assertNotEqual(v.returncode,0)
        self.assertIn("original logo manifest binding mismatch",v.stderr)

if __name__=="__main__":
    unittest.main()
