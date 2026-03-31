/**
 * RigSelector Component
 * Searchable dropdown for selecting a piling rig from the database.
 * Groups rigs by manufacturer with weight/category badges.
 * Mobile-optimized with large touch targets.
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, ChevronDown, ChevronUp, X, Truck
} from "lucide-react";
import {
  PILING_RIGS,
  type PilingRig,
  getManufacturers,
} from "@/lib/rig-database";

interface RigSelectorProps {
  onSelect: (rig: PilingRig) => void;
  selectedRigId?: string;
  onClear: () => void;
}

const categoryColors: Record<PilingRig["category"], string> = {
  Light: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Medium: "bg-blue-100 text-blue-800 border-blue-200",
  Heavy: "bg-amber-100 text-amber-800 border-amber-200",
  "Super Heavy": "bg-red-100 text-red-800 border-red-200",
};

const manufacturerColors: Record<string, string> = {
  Liebherr: "bg-yellow-500",
  Bauer: "bg-blue-600",
  Soilmec: "bg-red-600",
};

export default function RigSelector({ onSelect, selectedRigId, onClear }: RigSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterManufacturer, setFilterManufacturer] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const manufacturers = useMemo(() => getManufacturers(), []);

  const selectedRig = useMemo(
    () => PILING_RIGS.find((r) => r.id === selectedRigId),
    [selectedRigId]
  );

  const filteredRigs = useMemo(() => {
    let rigs = PILING_RIGS;
    if (filterManufacturer) {
      rigs = rigs.filter((r) => r.manufacturer === filterManufacturer);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rigs = rigs.filter(
        (r) =>
          r.model.toLowerCase().includes(q) ||
          r.manufacturer.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          String(r.operatingWeight).includes(q)
      );
    }
    return rigs;
  }, [search, filterManufacturer]);

  // Group by manufacturer
  const grouped = useMemo(() => {
    const groups: Record<string, PilingRig[]> = {};
    for (const rig of filteredRigs) {
      if (!groups[rig.manufacturer]) groups[rig.manufacturer] = [];
      groups[rig.manufacturer].push(rig);
    }
    return groups;
  }, [filteredRigs]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (rig: PilingRig) => {
    onSelect(rig);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onClear();
    setSearch("");
    setFilterManufacturer(null);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected rig display / trigger button */}
      {selectedRig ? (
        <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${manufacturerColors[selectedRig.manufacturer] || "bg-gray-500"}`}
          />
          <div className="flex-1 min-w-0">
            <div className="font-heading font-semibold text-base truncate">
              {selectedRig.manufacturer} {selectedRig.model}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedRig.operatingWeight}t · W={selectedRig.W}m · q1k={selectedRig.q1k} kPa · q2k={selectedRig.q2k} kPa
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors text-left"
        >
          <Truck className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <div className="font-heading font-semibold text-base">Select a Piling Rig</div>
            <div className="text-sm text-muted-foreground">
              Choose from {PILING_RIGS.length} models · Liebherr, Bauer, Soilmec
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      )}

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl max-h-[70vh] flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search rig model, manufacturer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 text-base"
              />
            </div>
          </div>

          {/* Manufacturer filter tabs */}
          <div className="flex gap-1.5 p-3 border-b border-border overflow-x-auto">
            <button
              onClick={() => setFilterManufacturer(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !filterManufacturer
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              All ({PILING_RIGS.length})
            </button>
            {manufacturers.map((m) => (
              <button
                key={m}
                onClick={() => setFilterManufacturer(filterManufacturer === m ? null : m)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterManufacturer === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Rig list */}
          <div className="overflow-y-auto flex-1">
            {Object.keys(grouped).length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No rigs found matching "{search}"
              </div>
            ) : (
              Object.entries(grouped).map(([manufacturer, rigs]) => (
                <div key={manufacturer}>
                  <div className="sticky top-0 bg-muted/80 backdrop-blur px-4 py-2 flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${manufacturerColors[manufacturer] || "bg-gray-500"}`}
                    />
                    <span className="font-heading font-semibold text-sm">{manufacturer}</span>
                    <span className="text-xs text-muted-foreground">({rigs.length})</span>
                  </div>
                  {rigs.map((rig) => (
                    <button
                      key={rig.id}
                      onClick={() => handleSelect(rig)}
                      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border/50 ${
                        rig.id === selectedRigId ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold text-base">
                          {rig.model}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${categoryColors[rig.category]}`}
                        >
                          {rig.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto font-mono">
                          {rig.operatingWeight}t
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{rig.description}</div>
                      <div className="flex gap-3 mt-1.5 text-xs font-mono text-muted-foreground">
                        <span>W={rig.W}m</span>
                        <span>L1={rig.L1}m</span>
                        <span>L2={rig.L2}m</span>
                        <span>q1k={rig.q1k}</span>
                        <span>q2k={rig.q2k}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-border bg-muted/50 text-xs text-muted-foreground">
            Values are typical configurations. Always verify against the rig's EN 996 data sheet.
          </div>
        </div>
      )}
    </div>
  );
}
