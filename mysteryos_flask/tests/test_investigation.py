"""
Automated Pytest Suite for MysteryOS Investigation Logic
Verifies deterministic deduction scoring, contradiction alerts, and timeline reconstruction.
"""
import pytest
from app.investigation.scoring_engine import evaluate_accusation
from app.investigation.contradiction_engine import evaluate_contradictions

def test_flawless_accusation_scoring():
    """Test 100-point flawless deduction without hints"""
    result = evaluate_accusation(
        culprit_id="suspect_evelyn_vance",
        submitted_culprit_id="suspect_evelyn_vance",
        verified_motive="Bankruptcy and urgent foreclosure in London; secret Zurich sale.",
        submitted_motive="Facing bankruptcy in London with debt and urgent foreclosure.",
        verified_method="Synthetic cubic zirconia swap with silenced greased hinges and swipe at 10:22 PM.",
        submitted_method="Synthetic duplicate swapped into vault with lock grease at 10:22 PM.",
        required_clue_ids=["clue_synthetic_gem", "clue_security_ledger", "clue_emerald_silk_glove"],
        submitted_clue_ids=["clue_synthetic_gem", "clue_security_ledger", "clue_emerald_silk_glove"],
        verified_timeline_order=["evt_1", "evt_2", "evt_3"],
        submitted_timeline_order=["evt_1", "evt_2", "evt_3"],
        unlocked_hint_tiers=[]
    )

    assert result["culprit_score"] == 30
    assert result["motive_score"] == 15
    assert result["method_score"] == 15
    assert result["evidence_score"] == 25
    assert result["timeline_score"] == 15
    assert result["hint_deductions"] == 0
    assert result["total_score"] == 100
    assert result["is_solved"] is True

def test_incorrect_culprit_zero_deduction():
    """Lucky guesses or accusing innocent suspects receives 0 culprit score"""
    result = evaluate_accusation(
        culprit_id="suspect_evelyn_vance",
        submitted_culprit_id="suspect_julian_croft",
        verified_motive="Bankruptcy and debt.",
        submitted_motive="He was disinherited.",
        verified_method="Synthetic gem swap.",
        submitted_method="He stole it while smoking.",
        required_clue_ids=["clue_1"],
        submitted_clue_ids=[],
        verified_timeline_order=["evt_1"],
        submitted_timeline_order=["evt_1"],
        unlocked_hint_tiers=[]
    )

    assert result["culprit_score"] == 0
    assert result["is_solved"] is False

def test_contradiction_detection():
    """Contradiction triggers only when the refuting clue is discovered"""
    rules = [
        {
            "id": "contra_vance_alibi",
            "contradicting_clue_id": "clue_security_ledger",
            "title": "Study Presence vs Library Alibi"
        }
    ]

    # Without clue
    untriggered = evaluate_contradictions(rules, [])
    assert len(untriggered["active_contradictions"]) == 0
    assert untriggered["pending_count"] == 1

    # With clue discovered
    triggered = evaluate_contradictions(rules, ["clue_security_ledger"])
    assert len(triggered["active_contradictions"]) == 1
    assert triggered["pending_count"] == 0
