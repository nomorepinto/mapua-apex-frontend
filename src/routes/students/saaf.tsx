import { useRef } from "react"

import { ConfirmSubmitModal } from "@/components/forms/confirm-submit-modal"
import { FormPageHeader } from "@/components/forms/form-page-header"
import { SuccessModal } from "@/components/forms/success-modal"
import { ActivityClassificationSection } from "@/components/submission/activity-classification-section"
import { ActivityDetailsSection } from "@/components/submission/activity-details-section"
import { BudgetProposalSection } from "@/components/submission/budget-proposal-section"
import { InstitutionalAlignmentSection } from "@/components/submission/institutional-alignment-section"
import { ProponentsSection } from "@/components/submission/proponents-section"
import { SubmissionActions } from "@/components/submission/submission-actions"
import { useSaafForm } from "@/hooks/use-saaf-form"

export function Submission() {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useSaafForm()
  const { draft } = form

  return (
    <div className="relative min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <form.fetcher.Form ref={formRef} method="post" className="space-y-10">
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
