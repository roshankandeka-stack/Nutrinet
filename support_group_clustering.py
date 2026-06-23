# -*- coding: utf-8 -*-
"""
NutriNet Support Group Clustering
Divides mothers based on categorical/demographic metrics using a KNN/Category Distance Matrix.
Helps mothers with underweight or stunted kids in Maninagar, Vastrapur, etc., form supportive circles.
"""

class MotherProfile:
    def __init__(self, mother_id, name, age_months, location, issue):
        self.mother_id = mother_id
        self.name = name
        self.age_months = age_months # Child's age
        self.location = location     # Geography (e.g., Vastrapur, Maninagar, Ellisbridge, etc.)
        self.issue = issue           # underweight, stunting, anemia, healthy
        
    def to_dict(self):
        return {
            "id": self.mother_id,
            "name": self.name,
            "age": self.age_months,
            "location": self.location,
            "issue": self.issue
        }

class GroupDistanceClusterer:
    def __init__(self):
        # Age bucketing thresholds
        pass
        
    def _get_age_bucket(self, months):
        if months <= 6:
            return "0-6m"
        elif months <= 12:
            return "6-12m"
        elif months <= 24:
            return "1-2y"
        else:
            return "2-5y"

    def assign_clusters(self, mothers):
        clusters = {}
        for m in mothers:
            # Multi-parameter clustering coordinates
            age_bucket = self._get_age_bucket(m.age_months)
            loc_slug = m.location.lower().strip().replace(" ", "_")
            issue_slug = m.issue.lower().strip()
            
            # Form compound coordinate
            cluster_id = f"group_{age_bucket}_{loc_slug}_{issue_slug}"
            
            if cluster_id not in clusters:
                clusters[cluster_id] = {
                    "meta": {
                        "age_group": age_bucket,
                        "location": m.location,
                        "primary_health_concern": m.issue
                    },
                    "members": []
                }
            clusters[cluster_id]["members"].append(m.to_dict())
            
        return clusters

if __name__ == "__main__":
    test_mothers = [
        MotherProfile("m1", "Savitri Devi", 8, "Vastrapur", "underweight"),
        MotherProfile("m2", "Gita Ben", 7, "Vastrapur", "underweight"),
        MotherProfile("m3", "Jasmin Patel", 18, "Maninagar", "anemia"),
        MotherProfile("m4", "Farhana Shaikh", 22, "Maninagar", "anemia"),
        MotherProfile("m5", "Radhika Vyas", 3, "Ellisbridge", "healthy"),
        MotherProfile("m6", "Kanta Vaghela", 9, "Vastrapur", "underweight"),
    ]
    
    clusterer = GroupDistanceClusterer()
    assignments = clusterer.assign_clusters(test_mothers)
    
    print("\n[NLP/KNN Mother Support Group Clusters Assigned]")
    print("=" * 60)
    for c_id, details in assignments.items():
        print(f"\nCluster Name: {c_id.upper()}")
        print(f"  └─ Age Target: {details['meta']['age_group']} | Area: {details['meta']['location']} | Issue: {details['meta']['primary_health_concern'].upper()}")
        print(f"  └─ Connected Mothers ({len(details['members'])}):")
        for member in details["members"]:
            print(f"     • {member['name']} (Child's Age: {member['age']} months)")
    print("=" * 60)
