import { Navigate, useSearchParams } from "react-router"
import { useRef } from "react"

import { AvTable } from "@/components/reservation/av-table"
import { EquipmentSection } from "@/components/reservation/equipment-section"
import { FacilityTable } from "@/components/reservation/facility-table"
import { ReservationActions } from "@/components/reservation/reservation-actions"
import { RoomTable } from "@/components/reservation/room-table"
import { ConfirmClearModal } from "@/components/forms/confirm-clear-modal"
import { ConfirmSubmitModal } from "@/components/forms/confirm-submit-modal"
import { FormPageHeader } from "@/components/forms/form-page-header"
import { SubmissionErrorAlert } from "@/components/forms/submission-error-alert"
import { SuccessModal } from "@/components/forms/success-modal"
import { useReservationForm } from "@/hooks/use-reservation-form"
import { useOrgStore } from "@/stores/org-store"
import { layout } from "@/config"
import { cn } from "@/lib/utils"

export function Reservation() {
  const reserveFacilities = useOrgStore((state) => state.reserveFacilities)
  const saafValidated = useOrgStore((state) => state.saafValidated)
  const [searchParams] = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)
  const form = useReservationForm()
  const { draft } = form

  if (reserveFacilities !== "yes" || !saafValidated) {
    const query = searchParams.toString()
    return (
      <Navigate
        to={`/students/submissions/saaf${query ? `?${query}` : ""}`}
        replace
      />
    )
  }

  return (
    <div className={cn("relative", layout.page)}>
      <div className={cn(layout.container, layout.stack)}>
        <FormPageHeader
          title="Reservation of Facilities"
          subtitle="Academic Term: 2026 - 2027 • Unified Activity Proposal Application"
        />

        <div className="space-y-0.5">
          <h2 className="text-sm font-bold tracking-wide text-neutral-900 uppercase">
            APPLICATION FORM ON USE OF FACILITIES
          </h2>
          <p className="text-xs font-semibold text-neutral-800">
            (North &amp; South Circle, Hallways, Pavilions, Ground, etc.)
          </p>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={(e) => form.handleInitiateSubmit(e, formRef.current)}
          className={cn("space-y-8", form.showErrors && "saaf-show-errors")}
        >
          <EquipmentSection
            equipment={draft.equipment}
            otherEquipmentText={draft.otherEquipmentText}
            onToggle={form.toggleEquipment}
            onOtherTextChange={(value) =>
              form.updateField("otherEquipmentText", value)
            }
          />

          <FacilityTable
            purpose={draft.purpose}
            items={draft.facilityItems}
            onPurposeChange={(value) => form.updateField("purpose", value)}
            onUpdate={form.handleUpdateFacilityItem}
            onRemove={form.handleRemoveFacilityItem}
            onAdd={form.handleAddFacilityItem}
          />

          <RoomTable
            purpose={draft.functionRoomPurpose}
            items={draft.roomItems}
            onPurposeChange={(value) =>
              form.updateField("functionRoomPurpose", value)
            }
            onUpdate={form.handleUpdateRoomItem}
            onRemove={form.handleRemoveRoomItem}
            onAdd={form.handleAddRoomItem}
          />

          <AvTable
            purpose={draft.avPurpose}
            items={draft.avItems}
            onPurposeChange={(value) => form.updateField("avPurpose", value)}
            onUpdate={form.handleUpdateAvItem}
            onRemove={form.handleRemoveAvItem}
            onAdd={form.handleAddAvItem}
          />

          <SubmissionErrorAlert message={form.submitError} />

          <ReservationActions
            isSubmitting={form.isSubmitting}
            onSavePdf={form.handleSavePdf}
            onGoBack={form.handleGoBack}
            onClear={() => form.setShowConfirmClearModal(true)}
          />
        </form>
      </div>

      <ConfirmClearModal
        open={form.showConfirmClearModal}
        title="Are you sure you want to clear?"
        description="This action will clear your facility reservation form with the data you have inputted."
        onClose={() => form.setShowConfirmClearModal(false)}
        onConfirm={form.handleClearForm}
      />

      <ConfirmSubmitModal
        open={form.showConfirmModal}
        description="This action will submit your facility reservation form with the data you have inputted."
        onClose={() => form.setShowConfirmModal(false)}
        onConfirm={form.handleConfirmProceed}
      />

      <SuccessModal
        open={form.showSuccessModal}
        title="Facility Reservation Submitted!"
        actionLabel="Back to Submission"
        onAction={form.handleSuccessAction}
      />
    </div>
  )
}