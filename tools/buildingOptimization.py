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
        """Generates data for all buildings according to the game formula"""
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
        """Calculates costs according to the game formula: baseCost * cost Multiplier^tier * (1 + 0.1 * upgrade)"""
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
        """Gets the current upgrade cost according to the in-game formula"""
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
        """Creates separate production and cost charts with markers every 10 levels and cost summaries"""
        buildings = self.all_data["building"].unique()
        if len(buildings) == 0:
            print("Brak danych do wyświetlenia")
            return

        # Utwórz siatkę wykresów
        fig, axes = plt.subplots(len(buildings), 2, figsize=(20, 6*len(buildings)))
        fig.suptitle("Analiza budynków", y=1.02, fontsize=16)
        
        if len(buildings) == 1:
            axes = [axes]

        for idx, building_type in enumerate(buildings):
            bldg_data = self.all_data[self.all_data["building"] == building_type]
            
            # Wykres produkcji
            ax_prod = axes[idx][0]
            resources = [r for r in RESOURCE_TYPES if r in bldg_data.columns]
            for resource in resources:
                ax_prod.plot(
                    bldg_data["total_upgrades"],
                    bldg_data[resource],
                    label=f"{resource}",
                    marker="o",
                    markersize=6,
                    linewidth=2
                )
            ax_prod.set_title(f"{building_type} - Produkcja", fontsize=12)
            ax_prod.set_xlabel("Łączne ulepszenia")
            ax_prod.set_ylabel("Produkcja")
            ax_prod.grid(True, alpha=0.3)
            ax_prod.legend()
            
            # Wykres kosztów z dodatkowymi elementami
            ax_cost = axes[idx][1]
            cost_columns = [c for c in bldg_data.columns if c.startswith("cost_")]
            
            # Oblicz koszty skumulowane
            milestones = range(0, bldg_data["total_upgrades"].max()+1, 10)
            cumulative_costs = {}
            
            for cost_col in cost_columns:
                resource = cost_col.replace("cost_", "")
                costs = bldg_data[cost_col]
                
                # Zaznacz co 10 poziom tylko jeśli istnieją dane
                mask = (bldg_data["total_upgrades"] % 10 == 0) & (~np.isnan(costs))
                if mask.any():
                    ax_cost.scatter(
                        bldg_data[mask]["total_upgrades"],
                        costs[mask],
                        marker="D",
                        s=80,
                        edgecolors='red',
                        facecolors='none',
                        zorder=3
                    )
                
                # Oblicz koszty skumulowane pomijając NaN
                cumulative = []
                current_sum = 0
                for level in milestones:
                    if level >= len(costs) or np.isnan(costs.iloc[level]):
                        break
                    current_sum += costs.iloc[level]
                    cumulative.append(current_sum)
                
                if cumulative:  # Dodaj tylko jeśli są jakieś koszty
                    cumulative_costs[resource] = cumulative
            
            # Dodaj tekst z podsumowaniem tylko dla zasobów z kosztami
            summary_text = "Koszt całkowity do poziomu:\n"
            for resource, costs in cumulative_costs.items():
                summary_text += f"\n{resource.capitalize()}:\n"
                for i, (level, cost) in enumerate(zip(milestones, costs)):
                    if i >= len(costs):
                        break
                    if i % 2 == 0:
                        summary_text += f"{level:3}: {cost:,.0f}  "
                    else:
                        summary_text += f"{level:3}: {cost:,.0f}\n"
            
            # Wykres liniowy kosztów z filtracją NaN
            for cost_col in cost_columns:
                resource = cost_col.replace("cost_", "")
                clean_data = bldg_data[~np.isnan(bldg_data[cost_col])]
                if not clean_data.empty:
                    ax_cost.plot(
                        clean_data["total_upgrades"],
                        clean_data[cost_col],
                        label=f"{resource}",
                        linestyle="--",
                        linewidth=2,
                        alpha=0.8
                    )
            
            ax_cost.set_title(f"{building_type} - Koszty", fontsize=12)
            ax_cost.set_xlabel("Łączne ulepszenia")
            ax_cost.set_ylabel("Koszt")
            ax_cost.grid(True, alpha=0.3)
            ax_cost.legend()
            
            # Dodaj tekst z podsumowaniem tylko jeśli są dane
            if cumulative_costs:
                ax_cost.text(
                    1.05, 0.5,
                    summary_text,
                    transform=ax_cost.transAxes,
                    fontsize=9,
                    verticalalignment='center',
                    bbox=dict(facecolor='white', alpha=0.8)
                )

        plt.tight_layout()
        plt.subplots_adjust(right=0.85, hspace=0.4)
        plt.show()

    def simulate_development(self, steps=100, energy_critical=50):
        """Development simulation with improved cost calculations"""
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

if __name__ == "__main__":
    building_config = json.loads(open("src/data/buildings/p_food.json").read())
    
    analyzer = BuildingAnalyzer(building_config)
    analyzer.generate_data()
    analyzer.plot_separate_production_and_costs()
    analyzer.simulate_development(steps=20)