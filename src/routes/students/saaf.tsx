import { useRef } from "react"

import { ConfirmSubmitModal } from "@/components/forms/confirm-submit-modal"
import { FormPageHeader } from "@/components/forms/form-page-header"
import { SubmissionErrorAlert } from "@/components/forms/submission-error-alert"
import { SuccessModal } from "@/components/forms/success-modal"
import { ActivityClassificationSection } from "@/components/submission/activity-classification-section"
import { ActivityDetailsSection } from "@/components/submission/activity-details-section"
import { BudgetProposalSection } from "@/components/submission/budget-proposal-section"
import { InstitutionalAlignmentSection } from "@/components/submission/institutional-alignment-section"
import { ProponentsSection } from "@/components/submission/proponents-section"
import { SubmissionActions } from "@/components/submission/submission-actions"
import { useSaafForm } from "@/hooks/use-saaf-form"
import { layout } from "@/config"
import { cn } from "@/lib/utils"

export function Submission() {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useSaafForm()
  const { draft } = form

  return (
    <div className={cn("relative", layout.page)}>
      <div className={layout.container}>
        <form.fetcher.Form ref={formRef} method="post" className={layout.stack}>
          <FormPageHeader
            title="Student Activity Application Form"
            subtitle="Academic Term: 2026 - 2027 • Unified Activity Proposal Application"
          />

          <ActivityClassificationSection
            activityType={draft.activityType}
            totalOrgMembers={draft.totalOrgMembers}
            onActivityTypeChange={(value) => form.updateField("activityType", value)}
            onTotalOrgMembersChange={(value) =>
              form.updateField("totalOrgMembers", value)
            }
          />

          <ProponentsSection
            proponents={draft.proponents}
            departmentValues={draft.departmentValues}
            onUpdate={form.handleUpdateProponent}
            onRemove={form.handleRemoveProponent}
            onAdd={form.handleAddProponent}
            onDepartmentChange={form.handleDepartmentChange}
          />

          <ActivityDetailsSection
            values={draft}
            onChange={form.updateField}
          />

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

          <SubmissionErrorAlert message={form.submitError} />

          <SubmissionActions
            isSubmitting={form.isSubmitting}
            showNextPage={form.reserveFacilities === "yes"}
            onNextPage={() => form.handleGoToReservation(formRef.current)}
            onSavePdf={form.handleSavePdf}
            onSubmit={(e) => form.handleInitiateSubmit(e, formRef.current)}
          />
        </form.fetcher.Form>
      </div>

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
