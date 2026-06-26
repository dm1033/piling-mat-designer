/**
 * PromoCodeInput — reusable promo code validation component
 * Validates a Stripe promotion code server-side and shows discount details.
 * Used on both the Calculator checkout and CPD booking form.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export interface AppliedPromo {
  promotionCodeId: string;
  code: string;
  discountDescription: string;
  percentOff: number | null;
  amountOff: number | null;
  discountedDesignPrice: number | null;
  discountedCpdPrice: number | null;
  name: string | null;
}

interface PromoCodeInputProps {
  /** Called when a valid promo code is applied */
  onApply: (promo: AppliedPromo) => void;
  /** Called when the promo code is removed */
  onRemove: () => void;
  /** Currently applied promo (if any) */
  appliedPromo: AppliedPromo | null;
  /** Disable the input (e.g. while checkout is in progress) */
  disabled?: boolean;
}

export default function PromoCodeInput({
  onApply,
  onRemove,
  appliedPromo,
  disabled = false,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateMutation = trpc.promo.validate.useMutation({
    onSuccess(data) {
      if (data.valid) {
        onApply({
          promotionCodeId: data.promotionCodeId,
          code: data.code,
          discountDescription: data.discountDescription,
          percentOff: data.percentOff,
          amountOff: data.amountOff,
          discountedDesignPrice: data.discountedDesignPrice,
          discountedCpdPrice: data.discountedCpdPrice,
          name: data.name,
        });
        setCode("");
        setError(null);
      } else {
        setError(data.message);
      }
    },
    onError(err) {
      setError(err.message || "Failed to validate code. Please try again.");
    },
  });

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a promotion code");
      return;
    }
    setError(null);
    validateMutation.mutate({ code: trimmed });
  };

  const handleRemove = () => {
    setCode("");
    setError(null);
    onRemove();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  // Applied state
  if (appliedPromo) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 border-green-200 font-mono text-xs"
            >
              {appliedPromo.code}
            </Badge>
            <span className="text-sm font-semibold text-green-700">
              {appliedPromo.discountDescription}
            </span>
            {appliedPromo.name && (
              <span className="text-xs text-green-600 truncate">
                — {appliedPromo.name}
              </span>
            )}
          </div>
          <p className="text-xs text-green-600 mt-0.5">
            Discount will be applied at checkout
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={disabled}
          className="text-green-700 hover:text-red-600 hover:bg-red-50 shrink-0 h-7 px-2"
        >
          <XCircle className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  // Input state
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Promotion code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled || validateMutation.isPending}
            className="pl-9 font-mono uppercase tracking-wider text-sm"
            maxLength={50}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={disabled || validateMutation.isPending || !code.trim()}
          className="shrink-0"
        >
          {validateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <XCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
