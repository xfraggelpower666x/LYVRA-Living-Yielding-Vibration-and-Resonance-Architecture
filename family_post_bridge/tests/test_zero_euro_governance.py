"""No-cost, production-isolation regression gate (source-only)."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class ZeroEuroGovernanceTests(unittest.TestCase):
    def test_no_database_dependency_in_production_requirements(self):
        requirements = (ROOT / "requirements.txt").read_text().lower()
        for package in ("psycopg", "sqlalchemy", "redis", "asyncpg"):
            self.assertNotIn(package, requirements)

    def test_prod_entrypoint_never_imports_db_candidates(self):
        production = (ROOT / "server.py").read_text()
        runtime = (ROOT / "mcp_runtime_candidate.py").read_text()
        for name in ("durable_registry_candidate", "commit_recovery_candidate",
                     "delivery_orchestrator_candidate",
                     "receipt_finalization_candidate", "psycopg", "redis"):
            self.assertNotIn(name, production)
            self.assertNotIn(name, runtime)

    def test_mcp_writer_uses_existing_writer_only(self):
        adapter = (ROOT / "mcp_writer_adapter.py").read_text()
        self.assertIn("from family_post_bridge.server import Letter, do_write", adapter)

    def test_ci_does_not_run_postgres_or_billable_services(self):
        workflow = (ROOT.parent / ".github/workflows/lyvra-family-post-mcp-candidate.yml").read_text()
        self.assertNotIn("postgres-concurrency:", workflow)
        self.assertNotIn("services:", workflow)

    def test_governance_lock_is_explicit(self):
        policy = (ROOT / "ZERO_EURO_GOVERNANCE_LOCK_20261024.md").read_text()
        self.assertIn("0.00 EUR", policy)
        self.assertIn("no automatic retry", policy)

if __name__ == "__main__":
    unittest.main()
