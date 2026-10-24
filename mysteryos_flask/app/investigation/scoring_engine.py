"""
Deterministic 100-Point Accusation Evaluation Engine (Python)
- Culprit: 30 pts
- Motive: 15 pts
- Method: 15 pts
- Evidence: 25 pts
- Timeline: 15 pts
- Transparent hint penalties
"""

def evaluate_accusation(
    culprit_id: str,
    submitted_culprit_id: str,
    verified_motive: str,
    submitted_motive: str,
    verified_method: str,
    submitted_method: str,
    required_clue_ids: list,
    submitted_clue_ids: list,
    verified_timeline_order: list,
    submitted_timeline_order: list,
    unlocked_hint_tiers: list
) -> dict:
    is_culprit_correct = culprit_id == submitted_culprit_id
    culprit_score = 30 if is_culprit_correct else 0

    motive_score = 0
    if is_culprit_correct:
        keywords = [w.lower() for w in verified_motive.split() if len(w) > 3]
        sub_m = (submitted_motive or '').lower()
        matched = sum(1 for k in keywords if k in sub_m)
        ratio = matched / max(len(keywords), 1)
        if ratio >= 0.4 or len(sub_m) > 20:
            motive_score = 15
        elif ratio >= 0.15 or len(sub_m) > 8:
            motive_score = 8

    method_score = 0
    if is_culprit_correct:
        keywords = [w.lower() for w in verified_method.split() if len(w) > 3]
        sub_m = (submitted_method or '').lower()
        matched = sum(1 for k in keywords if k in sub_m)
        ratio = matched / max(len(keywords), 1)
        if ratio >= 0.4 or len(sub_m) > 20:
            method_score = 15
        elif ratio >= 0.15 or len(sub_m) > 8:
            method_score = 8

    # Evidence score
    req_set = set(required_clue_ids or [])
    sub_set = set(submitted_clue_ids or [])
    matched_clues = len(req_set.intersection(sub_set))
    evidence_score = round((matched_clues / max(len(req_set), 1)) * 25)

    # Timeline score
    timeline_score = 0
    if verified_timeline_order and submitted_timeline_order:
        matches = 0
        limit = min(len(verified_timeline_order), len(submitted_timeline_order))
        for i in range(limit):
            if verified_timeline_order[i] == submitted_timeline_order[i]:
                matches += 1
        timeline_score = round((matches / len(verified_timeline_order)) * 15)

    # Hint Deductions
    hint_penalties = {1: 2, 2: 5, 3: 10}
    deductions = sum(hint_penalties.get(t, 2) for t in (unlocked_hint_tiers or []))

    raw_score = culprit_score + motive_score + method_score + evidence_score + timeline_score
    total_score = max(0, min(100, raw_score - deductions))
    is_solved = is_culprit_correct and total_score >= 65

    return {
        "total_score": total_score,
        "culprit_score": culprit_score,
        "motive_score": motive_score,
        "method_score": method_score,
        "evidence_score": evidence_score,
        "timeline_score": timeline_score,
        "hint_deductions": deductions,
        "is_solved": is_solved,
        "xp_awarded": total_score * 8 + (200 if is_solved else 50)
    }
