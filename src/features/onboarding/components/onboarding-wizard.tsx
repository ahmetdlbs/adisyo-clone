"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/config/routes";
import {
  BUSINESS_TYPES,
  createInitialOnboardingAnswers,
  KITCHEN_DELIVERY_OPTIONS,
  ONBOARDING_STEPS,
  PAYMENT_TIME_OPTIONS,
  PAYMENT_TYPES,
  RECEIPT_OPTIONS,
  toggleInList,
  WORK_TYPES,
  type OnboardingAnswers,
} from "../model/onboarding";

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Sipariş süreçlerinizi hızlandırmak için aşağıdaki bilgilere ihtiyacımız var",
  2: "Seçtiğiniz çalışma tiplerine göre süreçleri yapılandıralım",
  3: "Adisyo hesabınız başarıyla yapılandırıldı! Artık işletmenizi yönetmeye başlayabilirsiniz.",
};

const LAST_STEP = ONBOARDING_STEPS.length;

/** First-run setup: work/payment types, then operational preferences, then a finished screen. Nothing here persists yet. */
export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(createInitialOnboardingAnswers());

  const update = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => setAnswers((current) => ({ ...current, [key]: value }));

  const currentStep = ONBOARDING_STEPS[step - 1]!;

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="fixed top-0 left-0 flex h-screen w-[280px] flex-col items-center gap-10 bg-section py-12">
        <span className="text-2xl font-extrabold tracking-tight text-foreground">adisyo</span>

        <div className="relative size-28">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <path
              className="text-muted"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-primary"
              strokeWidth="2"
              strokeDasharray={`${(step / LAST_STEP) * 100}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">%{Math.round((step / LAST_STEP) * 100)}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {step}/{LAST_STEP}
            </span>
          </div>
        </div>

        <ol className="flex w-full flex-col gap-2 px-4">
          {ONBOARDING_STEPS.map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between rounded-xl p-4 ${item.id === step ? "bg-card shadow-sm" : "opacity-60"}`}
            >
              <span className="text-[15px] font-semibold text-foreground">{item.title}</span>
              {step > item.id && (
                <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
            </li>
          ))}
        </ol>
      </aside>

      <div className="ml-[280px] flex flex-1 flex-col items-center px-8 py-16 pb-32">
        <div className="w-full max-w-[850px]">
          <header className="mb-10 text-center">
            <h1 className="mb-3 text-2xl font-semibold text-foreground">{currentStep.title}</h1>
            <p className="text-[15px] text-muted-foreground">{STEP_DESCRIPTIONS[step]}</p>
          </header>

          {step === 1 && <StepOne answers={answers} update={update} />}
          {step === 2 && <StepTwo answers={answers} update={update} />}
          {step === 3 && <StepThree />}

          <div className="mt-12 flex items-center justify-center gap-4">
            {step > 1 && step < LAST_STEP && (
              <Button variant="secondary" size="xl" className="rounded-full px-10" onClick={() => setStep((current) => current - 1)}>
                Geri Dön
              </Button>
            )}
            {step < LAST_STEP ? (
              <Button size="xl" className="rounded-full px-10" onClick={() => setStep((current) => current + 1)}>
                Devam Et
              </Button>
            ) : (
              <Button size="xl" className="rounded-full px-10" onClick={() => router.push(ROUTES.dashboard)}>
                Adisyo&apos;ya Git
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepOne({ answers, update }: { answers: OnboardingAnswers; update: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="rounded-lg border bg-primary/5 px-4 py-3.5 text-center text-sm font-medium text-foreground">
        Çalışma ve ödeme tiplerini daha sonra Ayarlar ekranından değiştirebilir, ödeme tiplerinin sırasını düzenleyebilirsiniz.
      </p>

      <ToggleGroup legend="İşletmenizin Çalışma Tipi" options={WORK_TYPES} selected={answers.workTypes} onToggle={(value) => update("workTypes", toggleInList(answers.workTypes, value))} />
      <ToggleGroup
        legend="Kabul Ettiğiniz Ödeme Tipleri"
        options={PAYMENT_TYPES}
        selected={answers.paymentTypes}
        onToggle={(value) => update("paymentTypes", toggleInList(answers.paymentTypes, value))}
      />
    </div>
  );
}

function ToggleGroup({ legend, options, selected, onToggle }: { legend: string; options: readonly string[]; selected: readonly string[]; onToggle: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-4 text-sm font-medium text-muted-foreground">{legend}</legend>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((option) => {
          const isChecked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-5 transition-colors ${isChecked ? "border-primary shadow-sm" : "hover:border-primary/40"}`}
            >
              <Checkbox checked={isChecked} onCheckedChange={() => onToggle(option)} aria-label={option} />
              <span className="text-sm font-semibold text-foreground">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function StepTwo({ answers, update }: { answers: OnboardingAnswers; update: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-base font-semibold text-foreground">Gel-Al Sipariş Yönetimi</h2>
        <p className="mb-2 text-sm text-muted-foreground">Deneyiminizi iyileştirelim.</p>
      </div>

      <OptionCardGroup step={1} question="Siparişleriniz mutfağa nasıl iletiliyor?" options={KITCHEN_DELIVERY_OPTIONS} selected={answers.kitchenDelivery} onSelect={(value) => update("kitchenDelivery", value)} />
      <OptionCardGroup step={2} question="Ödeme genellikle ne zaman alınıyor?" options={PAYMENT_TIME_OPTIONS} selected={answers.paymentTime} onSelect={(value) => update("paymentTime", value)} />
      <OptionCardGroup step={3} question="Müşteriye fiş veriliyor mu?" options={RECEIPT_OPTIONS} selected={answers.receiptGiven} onSelect={(value) => update("receiptGiven", value)} />

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">İşletme Tipi</h3>
        <Select
          items={BUSINESS_TYPES.map((type) => ({ value: type, label: type }))}
          value={answers.businessType}
          onValueChange={(value) => update("businessType", String(value))}
        >
          <SelectTrigger className="w-full" aria-label="İşletme Tipi">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Gün Başlangıç Saati</h3>
          <input
            type="time"
            value={answers.dayStart}
            onChange={(event) => update("dayStart", event.target.value)}
            aria-label="Gün Başlangıç Saati"
            className="w-full rounded-lg border bg-card px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Gün Bitiş Saati</h3>
          <input
            type="time"
            value={answers.dayEnd}
            onChange={(event) => update("dayEnd", event.target.value)}
            aria-label="Gün Bitiş Saati"
            className="w-full rounded-lg border bg-card px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}

function OptionCardGroup({
  step,
  question,
  options,
  selected,
  onSelect,
}: {
  step: number;
  question: string;
  options: readonly { title: string; desc: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {step}
        </span>
        <h3 className="text-[15px] font-semibold text-foreground">{question}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((option) => {
          const isSelected = selected === option.title;
          return (
            <button
              key={option.title}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.title)}
              className={`flex flex-col gap-1 rounded-lg border p-5 text-left transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}
            >
              <span className="text-sm font-semibold text-foreground">{option.title}</span>
              <span className="text-[13px] text-muted-foreground">{option.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <span aria-hidden="true" className="mb-6 flex size-24 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="size-12" strokeWidth={2.5} />
      </span>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Her Şey Hazır!</h2>
      <p className="max-w-md text-muted-foreground">Tebrikler, temel işletme ayarlarınızı tamamladınız. Artık menünüzü oluşturmaya ve sipariş almaya başlayabilirsiniz.</p>
    </div>
  );
}
