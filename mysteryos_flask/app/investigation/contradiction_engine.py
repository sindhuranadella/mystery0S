"""
Deterministic Contradiction Detection Engine (Python)
Evaluates whether suspect claims conflict with discovered physical clues.
"""

def evaluate_contradictions(contradiction_rules: list, discovered_clue_ids: list) -> dict:
    discovered_set = set(discovered_clue_ids or [])
    active_contradictions = []
    pending_count = 0

    for rule in contradiction_rules:
        clue_id = rule.get('contradicting_clue_id')
        if clue_id in discovered_set:
            active_contradictions.append(rule)
        else:
            pending_count += 1

    return {
        "active_contradictions": active_contradictions,
        "pending_count": pending_count,
        "total_rules": len(contradiction_rules)
    }
