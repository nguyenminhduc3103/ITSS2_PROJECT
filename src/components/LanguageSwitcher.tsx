import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Lang; flag: string; label: string }[] = [
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useT();
  const current = OPTIONS.find((o) => o.code === lang) ?? OPTIONS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
          <Languages className="h-4 w-4" />
          <span className="text-base leading-none">{current.flag}</span>
          <span className="hidden text-xs font-medium sm:inline">
            {current.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.code}
            onClick={() => setLang(o.code)}
            className={cn(
              "gap-2",
              o.code === lang && "bg-secondary font-semibold",
            )}
          >
            <span className="text-base">{o.flag}</span>
            <span>{o.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
