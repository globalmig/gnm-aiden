"use client";

import Modal from "@/components/Modal";
import { AGREEMENT_CONTENTS, AGREEMENT_FOOTER, type AgreementContent } from "@/datas/agreements";

export default function AgreementModal({
  agreementId,
  onClose,
}: {
  agreementId: AgreementContent["id"];
  onClose: () => void;
}) {
  const content = AGREEMENT_CONTENTS[agreementId];

  return (
    <Modal title={content.modalTitle} onClose={onClose}>
      <div className="space-y-5">
        {content.sections.map((section) => (
          <div key={section.title}>
            <p className="text-base font-semibold text-gray-900">{section.title}</p>
            <div className="mt-1.5 space-y-1.5">
              {section.body.map((paragraph, index) =>
                Array.isArray(paragraph) ? (
                  <ul key={index} className="space-y-1">
                    {paragraph.map((item) => (
                      <li key={item} className="flex gap-2 text-base leading-6 text-gray-600">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={index} className="text-base leading-6 text-gray-600">
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">{AGREEMENT_FOOTER}</p>
    </Modal>
  );
}
