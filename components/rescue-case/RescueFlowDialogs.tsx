"use client";

import * as React from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClaimCase, useCreatePetFromCase, useReleaseClaim } from "@/hooks/use-rescue-flow";
import { usePetTaxonomy } from "@/hooks/use-pet";
import { apiErrorMessage } from "@/lib/api-error";
import { RELEASE_REASON_CHOICES, RESCUE_RELEASE_REASON_LABEL } from "@/lib/rescue-case-display";
import type { PetGender, PetHealthStatus } from "@/types/pet.type";
import type { RescueCase, RescueClaimReleaseReason } from "@/types/rescue-case.type";

/** What a person should keep in mind before going to an animal; shown before a personal claim. */
const SAFETY_NOTES = [
  "Giữ an toàn cho bạn trước: không đứng giữa đường, không bắt thú đang hoảng sợ bằng tay không.",
  "Thú bị thương có thể cắn. Dùng khăn dày hoặc găng tay, đeo khẩu trang nếu được.",
  "Không cho ăn uống nếu thú bị xe đụng hoặc khó thở; giữ ấm và đưa tới thú y sớm nhất.",
  "Bạn có 4 giờ cho ca này, gia hạn được. Không đi được nữa thì trả ca để người khác nhận.",
];

export function ClaimCaseDialog({
  rescueCase,
  asOrganization,
  open,
  onOpenChange,
}: {
  rescueCase: RescueCase;
  /** Staff claim for their organization: no safety notes, the case is locked to the organization. */
  asOrganization: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const claimMutation = useClaimCase();
  const [acknowledged, setAcknowledged] = React.useState(false);

  const submit = async () => {
    try {
      await claimMutation.mutateAsync({ caseId: rescueCase.caseId, safetyAcknowledged: asOrganization || acknowledged });
      toast.success(
        asOrganization
          ? "Trung tâm đã nhận ca. Người báo ca sẽ được báo."
          : "Bạn đã nhận ca. Người báo ca sẽ được báo là có người đang đến.",
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !claimMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{asOrganization ? "Nhận ca cho trung tâm" : "Tôi đang đến giúp"}</DialogTitle>
          <DialogDescription>
            {asOrganization
              ? `Ca ${rescueCase.caseCode} sẽ do trung tâm của bạn phụ trách; tổ chức khác không nhận được nữa.`
              : `Bạn sẽ thấy số điện thoại người báo ca ${rescueCase.caseCode} và họ biết có người đang đến.`}
          </DialogDescription>
        </DialogHeader>

        {asOrganization ? null : (
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4" aria-hidden /> Lưu ý an toàn
              </div>
              <ul className="list-disc space-y-1 pl-5">
                {SAFETY_NOTES.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked={acknowledged} onCheckedChange={(value) => setAcknowledged(Boolean(value))} />
              <span>Tôi đã đọc lưu ý an toàn</span>
            </label>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={claimMutation.isPending}>
            Để sau
          </Button>
          <Button onClick={submit} disabled={claimMutation.isPending || (!asOrganization && !acknowledged)}>
            {claimMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {asOrganization ? "Nhận ca" : "Tôi đang đến"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReleaseClaimDialog({
  caseId,
  open,
  onOpenChange,
}: {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const releaseMutation = useReleaseClaim();
  const [reason, setReason] = React.useState<RescueClaimReleaseReason>("GAVE_UP");

  const submit = async () => {
    try {
      await releaseMutation.mutateAsync({ caseId, reason });
      toast.success("Đã trả ca. Ca mở lại cho người khác nếu không còn ai đang giúp.");
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !releaseMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trả ca</DialogTitle>
          <DialogDescription>Không sao cả. Cho mọi người biết lý do để người sau đến giúp tốt hơn.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2" role="radiogroup" aria-label="Lý do trả ca">
          {RELEASE_REASON_CHOICES.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="release-reason"
                value={value}
                checked={reason === value}
                onChange={() => setReason(value)}
                className="accent-primary"
              />
              {RESCUE_RELEASE_REASON_LABEL[value]}
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={releaseMutation.isPending}>
            Giữ ca
          </Button>
          <Button variant="destructive" onClick={submit} disabled={releaseMutation.isPending}>
            {releaseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Trả ca
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Asks for a short reason, then runs onConfirm with it. Used to close a case, dispute or reject a report. */
export function ReasonDialog({
  title,
  description,
  placeholder,
  confirmLabel,
  destructive,
  open,
  onOpenChange,
  onConfirm,
}: {
  title: string;
  description: string;
  placeholder: string;
  confirmLabel: string;
  destructive?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const tooShort = reason.trim().length < 5;

  const submit = async () => {
    setPending(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="flow-reason">Lý do</Label>
          <Textarea
            id="flow-reason"
            rows={3}
            value={reason}
            placeholder={placeholder}
            onChange={(event) => setReason(event.target.value)}
            disabled={pending}
          />
          <p className="text-xs text-muted-foreground">Ít nhất 5 ký tự.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Huỷ
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={submit} disabled={pending || tooShort}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const GENDER_CHOICES: Array<{ value: PetGender; label: string }> = [
  { value: "UNKNOWN" as PetGender, label: "Chưa rõ" },
  { value: "MALE" as PetGender, label: "Đực" },
  { value: "FEMALE" as PetGender, label: "Cái" },
];

const HEALTH_CHOICES: Array<{ value: PetHealthStatus; label: string }> = [
  { value: "UNDER_TREATMENT" as PetHealthStatus, label: "Đang điều trị" },
  { value: "RECOVERING" as PetHealthStatus, label: "Đang hồi phục" },
  { value: "HEALTHY" as PetHealthStatus, label: "Khoẻ mạnh" },
  { value: "SPECIAL_NEEDS" as PetHealthStatus, label: "Cần chăm sóc đặc biệt" },
];

/**
 * Turns a rescued animal into a pet record, filled from the case. "intake" is the organization taking
 * it in (the pet starts in FOSTERING); "keep" is the rescuer adding it to their own pets.
 */
export function PetFromCaseDialog({
  rescueCase,
  mode,
  open,
  onOpenChange,
}: {
  rescueCase: RescueCase;
  mode: "intake" | "keep";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const taxonomyQuery = usePetTaxonomy();
  const createMutation = useCreatePetFromCase();
  const species = React.useMemo(() => taxonomyQuery.data ?? [], [taxonomyQuery.data]);
  const guessedSpecies = React.useMemo(() => {
    const text = (rescueCase.species ?? "").toLowerCase();
    return species.find((s) => s.name.toLowerCase() === text || s.nameVi?.toLowerCase() === text)?.speciesId;
  }, [rescueCase.species, species]);

  const [name, setName] = React.useState("");
  const [speciesId, setSpeciesId] = React.useState<string | undefined>();
  const [gender, setGender] = React.useState<PetGender>("UNKNOWN" as PetGender);
  const [ageMonths, setAgeMonths] = React.useState("");
  const [healthStatus, setHealthStatus] = React.useState<PetHealthStatus>("UNDER_TREATMENT" as PetHealthStatus);
  const [description, setDescription] = React.useState(rescueCase.description ?? "");

  const chosenSpecies = speciesId ?? guessedSpecies;
  const canSubmit = name.trim().length > 0 && !!chosenSpecies && !createMutation.isPending;

  const submit = async () => {
    try {
      await createMutation.mutateAsync({
        caseId: rescueCase.caseId,
        mode,
        payload: {
          name: name.trim(),
          speciesId: chosenSpecies,
          gender,
          age: ageMonths ? Number(ageMonths) : undefined,
          healthStatus,
          color: rescueCase.color || undefined,
          description: description.trim() || undefined,
          rescueCaseId: rescueCase.caseId,
          vaccinated: false,
          neutered: false,
        },
      });
      toast.success(
        mode === "intake"
          ? `Đã tạo hồ sơ cho ${name.trim()}. Bé đang được trung tâm chăm sóc.`
          : `Đã thêm ${name.trim()} vào thú của bạn.`,
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !createMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "intake" ? "Tiếp nhận bé về trung tâm" : "Thêm bé vào thú của tôi"}</DialogTitle>
          <DialogDescription>
            Điền từ ca {rescueCase.caseCode}. Chỉ cần tên và loài, phần còn lại sửa sau được.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pet-from-case-name">Tên bé *</Label>
            <Input
              id="pet-from-case-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: Mực"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pet-from-case-species">Loài *</Label>
              <Select value={chosenSpecies} onValueChange={setSpeciesId}>
                <SelectTrigger id="pet-from-case-species" className="w-full">
                  <SelectValue placeholder={taxonomyQuery.isPending ? "Đang tải..." : "Chọn loài"} />
                </SelectTrigger>
                <SelectContent>
                  {species.map((s) => (
                    <SelectItem key={s.speciesId} value={s.speciesId}>
                      {s.nameVi || s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pet-from-case-gender">Giới tính</Label>
              <Select value={gender} onValueChange={(value) => setGender(value as PetGender)}>
                <SelectTrigger id="pet-from-case-gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pet-from-case-age">Tuổi ước tính (tháng)</Label>
              <Input
                id="pet-from-case-age"
                type="number"
                min={0}
                max={360}
                inputMode="numeric"
                value={ageMonths}
                onChange={(event) => setAgeMonths(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pet-from-case-health">Sức khoẻ</Label>
              <Select value={healthStatus} onValueChange={(value) => setHealthStatus(value as PetHealthStatus)}>
                <SelectTrigger id="pet-from-case-health" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEALTH_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pet-from-case-description">Ghi chú</Label>
            <Textarea
              id="pet-from-case-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isPending}>
            Huỷ
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === "intake" ? "Tạo hồ sơ thú" : "Thêm vào thú của tôi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
