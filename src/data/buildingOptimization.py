import math
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, Any, List
import json

RESOURCE_TYPES = ["oxygen", "water", "food", "energy", "metals", "science"]
MAX_TIERS = 5
UPGRADES_PER_TIER = 10

class BuildingAnalyzer:
    def __init__(self, buildings: List[Dict[str, Any]]):
        self.buildings = buildings
        self.all_data = pd.DataFrame()


    def generate_data(self):
        """Generuje dane dla wszystkich budynków zgodnie z formułą z gry"""
        for building in self.buildings:
            building_data = []
            max_tier = building.get("maxTier", MAX_TIERS)
            
            for tier in range(1, max_tier + 1):
                for upgrade in range(UPGRADES_PER_TIER):
                    record = {
                        "building": building["type"],
                        "tier": tier,
                        "upgrade": upgrade,
                        "total_upgrades": (tier - 1) * UPGRADES_PER_TIER + upgrade,
                    }
                    
                    # Obliczenia dla każdego zasobu
                    productions = {}
                    for resource in RESOURCE_TYPES:
                        base_value = building.get("baseProduction", {}).get(resource, 0)
                        if base_value <= 0:
                            continue
                            
                        # Obliczenia produkcji zgodnie z formułą z gry
                        prod_multiplier = building.get("productionMultiplier", 1)
                        efficiency = building.get("efficiency", 1)
                        
                        tier_bonus = (tier - 1) * 10 * base_value * prod_multiplier
                        upgrade_bonus = math.log10(upgrade + 1) * 10 * base_value * prod_multiplier
                        total = base_value + tier_bonus + upgrade_bonus
                        production = math.sqrt(total) * base_value
                        
                        unique_bonus = 0
                        if tier == building.get("maxTier", MAX_TIERS):
                            unique_bonus = building.get("uniqueBonus", {}).get("production", {}).get(resource, 0) * 0.5
                        
                        final_production = production * efficiency + unique_bonus
                        productions[resource] = final_production
                    
                    # Nowa formuła kosztów
                    costs = self._calculate_costs(building, tier, upgrade)
                    
                    record.update(productions)
                    record.update(costs)
                    building_data.append(record)
            
            self.all_data = pd.concat([self.all_data, pd.DataFrame(building_data)])
        
        return self

    def _calculate_costs(self, building: Dict[str, Any], tier: int, upgrade: int) -> Dict[str, float]:
        """Oblicza koszty zgodnie z formułą z gry: baseCost * costMultiplier^tier * (1 + 0.1 * upgrade)"""
        costs = {}
        for resource in RESOURCE_TYPES:
            base_cost = building.get("baseCost", {}).get(resource, 0)
            if base_cost <= 0:
                continue
                
            cost_multiplier = building.get("costMultiplier", 2.0)
            cost = math.floor(
                base_cost * 
                (cost_multiplier ** tier) * 
                (1 + 0.1 * upgrade)
            )
            costs[f"cost_{resource}"] = cost
        
        return costs

    def _get_current_cost(self, building: Dict[str, Any], tier: int, upgrade: int) -> Dict[str, float]:
        """Pobiera aktualny koszt ulepszenia zgodnie z formułą z gry"""
        return {
            r: math.floor(
                building["baseCost"].get(r, 0) * 
                (building.get("costMultiplier", 2.0) ** tier) * 
                (1 + 0.1 * upgrade)
            )
            for r in RESOURCE_TYPES
            if building["baseCost"].get(r, 0) > 0
        }
    def plot_separate_production_and_costs(self):
        """Tworzy osobne wykresy produkcji i kosztów w oddzielnych oknach"""
        buildings = self.all_data["building"].unique()
        if len(buildings) == 0:
            print("Brak danych do wyświetlenia")
            return

        # Utwórz siatkę wykresów dla produkcji
        fig1, axes1 = plt.subplots(len(buildings), 1, figsize=(12, 6*len(buildings)))
        fig1.suptitle("Produkcja", y=1.02, fontsize=14)
        
        # Utwórz siatkę wykresów dla kosztów
        fig2, axes2 = plt.subplots(len(buildings), 1, figsize=(12, 6*len(buildings)))
        fig2.suptitle("Koszty", y=1.02, fontsize=14)

        if len(buildings) == 1:
            axes1 = [axes1]
            axes2 = [axes2]

        for idx, building_type in enumerate(buildings):
            bldg_data = self.all_data[self.all_data["building"] == building_type]
            
            # Wykres produkcji
            ax1 = axes1[idx]
            resources = [r for r in RESOURCE_TYPES if r in bldg_data.columns]
            for resource in resources:
                ax1.plot(
                    bldg_data["total_upgrades"],
                    bldg_data[resource],
                    label=f"{resource}",
                    marker="o",
                    linewidth=2
                )
            ax1.set_title(building_type, fontsize=12)
            ax1.set_xlabel("Łączne ulepszenia")
            ax1.set_ylabel("Produkcja")
            ax1.grid(True, alpha=0.3)
            ax1.legend()
            
            # Wykres kosztów
            ax2 = axes2[idx]
            cost_columns = [c for c in bldg_data.columns if c.startswith("cost_")]
            for cost_col in cost_columns:
                resource = cost_col.replace("cost_", "")
                ax2.plot(
                    bldg_data["total_upgrades"],
                    bldg_data[cost_col],
                    label=f"{resource}",
                    linestyle="--",
                    linewidth=2
                )
            ax2.set_title(building_type, fontsize=12)
            ax2.set_xlabel("Łączne ulepszenia")
            ax2.set_ylabel("Koszt")
            ax2.grid(True, alpha=0.3)
            ax2.legend()

        plt.tight_layout()
        plt.show()

    def simulate_development(self, steps=100, energy_critical=50):
        """Symulacja rozwoju z poprawionymi obliczeniami kosztów"""
        simulation_data = {b["type"]: {
            "tier": 1,
            "upgrade": 0,
            "total_upgrades": 0
        } for b in self.buildings}
        
        resources = {
            r: 1000.0 for r in RESOURCE_TYPES
        }
        resources["energy"] = 500.0

        for step in range(steps):
            print(f"\n--- Krok {step+1} ---")
            
            has_energy_crisis = resources["energy"] < energy_critical
            
            # Aktualizacja budynków
            for building in self.buildings:
                b_type = building["type"]
                current = simulation_data[b_type]
                
                # Poprawione obliczenia kosztów
                cost = self._get_current_cost(building, current["tier"], current["upgrade"])
                
                if all(resources[r] >= cost[r] for r in cost if cost[r] > 0):
                    # Zapłać koszty
                    for r, v in cost.items():
                        resources[r] -= v
                    
                    if current["upgrade"] < UPGRADES_PER_TIER - 1:
                        current["upgrade"] += 1
                    else:
                        current["tier"] = min(current["tier"] + 1, building.get("maxTier", MAX_TIERS))
                        current["upgrade"] = 0
                    
                    current["total_upgrades"] = (current["tier"] - 1) * UPGRADES_PER_TIER + current["upgrade"]
                    print(f"{b_type} ulepszony do Tier {current['tier']}.{current['upgrade']}")

            # Produkcja
            for building in self.buildings:
                b_type = building["type"]
                current = simulation_data[b_type]
                consumes_energy = building.get("baseConsumption", {}).get("energy", 0) > 0
                
                for resource in RESOURCE_TYPES:
                    base_value = building.get("baseProduction", {}).get(resource, 0)
                    if base_value == 0:
                        continue
                    
                    prod_multiplier = building.get("productionMultiplier", 1)
                    tier_bonus = (current["tier"] - 1) * 10 * base_value * prod_multiplier
                    upgrade_bonus = math.log10(current["upgrade"] + 1) * 10 * base_value * prod_multiplier
                    total = base_value + tier_bonus + upgrade_bonus
                    production = math.sqrt(total) * base_value
                    
                    unique_bonus = 0
                    if current["tier"] == building.get("maxTier", MAX_TIERS):
                        unique_bonus = building.get("uniqueBonus", {}).get("production", {}).get(resource, 0) * 0.5
                    
                    final_production = production * building.get("efficiency", 1) + unique_bonus
                    
                    if has_energy_crisis and consumes_energy:
                        final_production *= 0.1
                    
                    resources[resource] += final_production
            
            print("Stan zasobów:")
            for r, v in resources.items():
                print(f"{r}: {v:.2f}")

# Przykład użycia
if __name__ == "__main__":
    building_config = json.loads(open("buildings/p_food.json").read())
    
    analyzer = BuildingAnalyzer(building_config)
    analyzer.generate_data()
    analyzer.plot_separate_production_and_costs()
    analyzer.simulate_development(steps=20)