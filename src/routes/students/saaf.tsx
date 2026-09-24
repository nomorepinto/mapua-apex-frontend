import { useRef, useState } from "react"
import { CircleAlertIcon } from "lucide-react"

import { ConfirmClearModal } from "@/components/forms/confirm-clear-modal"
import { ConfirmSubmitModal } from "@/components/forms/confirm-submit-modal"
import { FormPageHeader } from "@/components/forms/form-page-header"
import { SubmissionErrorAlert } from "@/components/forms/submission-error-alert"
import { SuccessModal } from "@/components/forms/success-modal"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ActivityClassificationSection } from "@/components/submission/activity-classification-section"
import { ActivityDetailsSection } from "@/components/submission/activity-details-section"
import { BudgetProposalSection } from "@/components/submission/budget-proposal-section"
import { InstitutionalAlignmentSection } from "@/components/submission/institutional-alignment-section"
import { ProponentsSection } from "@/components/submission/proponents-section"
import {
  SaafStepper,
  type SaafStepIndex,
} from "@/components/submission/saaf-stepper"
import { SubmissionActions } from "@/components/submission/submission-actions"
import { brand, layout } from "@/config"
import { isSaafDraftComplete, isSaafStepComplete } from "@/components/submission/validate-saaf-step"
import { saafHasUserInput } from "@/components/submission/constants"
import { useSaafForm } from "@/hooks/use-saaf-form"
import { cn } from "@/lib/utils"

export function Submission() {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useSaafForm()
  const { draft } = form
  const [step, setStep] = useState<SaafStepIndex>(0)
  const [farthestStep, setFarthestStep] = useState<SaafStepIndex>(0)

  const goToStep = (next: SaafStepIndex) => {
    if (next === step || next > farthestStep) return
    if (next > step && !form.validateStep(step, formRef.current)) return
    if (next < step) {
      form.setShowErrors(false)
      form.setStepError(null)
    }
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goNext = () => {
    if (!form.validateStep(step, formRef.current)) return
    if (step >= 3) return
    const next = (step + 1) as SaafStepIndex
    setFarthestStep((current) => (next > current ? next : current))
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentStepComplete = isSaafStepComplete(step, draft)
  const formComplete = isSaafDraftComplete(draft)
  const canClear = saafHasUserInput(draft)

  const goBack = () => {
    if (step === 0) return
    goToStep((step - 1) as SaafStepIndex)
  }

  return (
    <div className={cn("relative", layout.page)}>
      <div className={layout.container}>
        <form.fetcher.Form
          ref={formRef}
          method="post"
          noValidate
          className={cn(layout.stack, form.showErrors && "saaf-show-errors")}
        >
          <FormPageHeader
            title="Student Activity Application Form"
            subtitle={
              draft.activityTitle
                ? `${draft.activityTitle} · Academic Term 2026–2027`
                : "Academic Term: 2026 - 2027 • Unified Activity Proposal Application"
            }
          />

          <SaafStepper
            step={step}
            farthestStep={farthestStep}
            eventTitle={draft.activityTitle}
            onStepSelect={goToStep}
          />

          <div
            data-saaf-step="0"
            className={cn(step !== 0 && "hidden")}
            aria-hidden={step !== 0}
          >
            <ActivityClassificationSection
              activityType={draft.activityType}
              totalOrgMembers={draft.totalOrgMembers}
              onActivityTypeChange={(value) => form.updateField("activityType", value)}
              onTotalOrgMembersChange={(value) =>
                form.updateField("totalOrgMembers", value)
              }
            />
          </div>

          <div
            data-saaf-step="1"
            className={cn(step !== 1 && "hidden")}
            aria-hidden={step !== 1}
          >
            <ProponentsSection
              proponents={draft.proponents}
              departmentValues={draft.departmentValues}
              onUpdate={form.handleUpdateProponent}
              onRemove={form.handleRemoveProponent}
              onAdd={form.handleAddProponent}
              onDepartmentChange={form.handleDepartmentChange}
            />
          </div>

          <div
            data-saaf-step="2"
            className={cn(step !== 2 && "hidden")}
            aria-hidden={step !== 2}
          >
            <ActivityDetailsSection
              values={draft}
              onChange={form.updateField}
            />
          </div>

          <div
            data-saaf-step="3"
            className={cn(step !== 3 && "hidden")}
            aria-hidden={step !== 3}
          >
            <InstitutionalAlignmentSection
              values={draft}
              onChange={form.updateField}
            />
            <BudgetProposalSection
              items={draft.budgetItems}
              grandTotal={form.grandTotal}
              onUpdate={form.handleUpdateBudgetItem}
              onRemove={form.handleRemoveBudgetItem}
              onAdd={form.handleAddBudgetItem}
            />
          </div>

          {step === 3 ? <SubmissionErrorAlert message={form.submitError} /> : null}

          {form.stepError ? (
            <Alert variant="error">
              <CircleAlertIcon />
              <AlertTitle>This step is incomplete</AlertTitle>
              <AlertDescription>{form.stepError}</AlertDescription>
            </Alert>
          ) : null}

          {step < 3 ? (
            <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className={cn(brand.actionGhost, "disabled:opacity-40")}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => form.setShowConfirmClearModal(true)}
                  disabled={!canClear}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-300/80 bg-white px-5 text-sm font-semibold text-red-600 shadow-xs transition-colors hover:border-red-400 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
              <button
                type="button"
                onClick={goNext}
                aria-disabled={!currentStepComplete}
                className={cn(
                  brand.action,
                  !currentStepComplete && "cursor-not-allowed opacity-40"
                )}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={goBack}
                  className={brand.actionGhost}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => form.setShowConfirmClearModal(true)}
                  disabled={!canClear}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-300/80 bg-white px-5 text-sm font-semibold text-red-600 shadow-xs transition-colors hover:border-red-400 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
              <SubmissionActions
                isSubmitting={form.isSubmitting}
                inactive={!formComplete}
                showNextPage={form.reserveFacilities === "yes"}
                onNextPage={() => form.handleGoToReservation(formRef.current)}
                onSavePdf={form.handleSavePdf}
                onSubmit={(e) => form.handleInitiateSubmit(e, formRef.current)}
              />
            </div>
          )}
        </form.fetcher.Form>
      </div>

      <ConfirmClearModal
        open={form.showConfirmClearModal}
        title="Are you sure you want to clear?"
        description="This action will clear your student activity form with the data you have inputted."
        onClose={() => form.setShowConfirmClearModal(false)}
        onConfirm={() => {
          form.handleClearForm()
          setStep(0)
          setFarthestStep(0)
        }}
      />

      <ConfirmSubmitModal
        open={form.showConfirmModal}
        description="This action will submit your student activity form with the data you have inputted."
        isSubmitting={form.isSubmitting}
        onClose={() => form.setShowConfirmModal(false)}
        onConfirm={() => form.handleConfirmProceed(formRef.current)}
      />

      <SuccessModal
        open={form.showSuccessModal}
        title="Activity Application Submitted!"
        actionLabel="Close"
        onAction={() => {
          form.setSuccessDismissed(true)
          window.location.reload()
        }}
      />
    </div>
  )
}
