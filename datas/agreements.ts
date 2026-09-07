import { COMPANY_INFO } from "@/datas/company";

export interface AgreementSection {
    title: string;
    body: (string | string[])[];
}

export interface AgreementContent {
    id: "collection" | "thirdParty" | "marketing";
    modalTitle: string;
    sections: AgreementSection[];
}

export const AGREEMENT_CONTENTS: Record<AgreementContent["id"], AgreementContent> = {
    collection: {
        id: "collection",
        modalTitle: "개인정보 수집 및 활용 동의",
        sections: [
            {
                title: "수집 목적",
                body: [
                    `${COMPANY_INFO.name}(이하 "회사")는 인터넷·TV 결합 상품 상담 신청 접수 및 처리, 맞춤 혜택 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.`,
                ],
            },
            {
                title: "수집 항목",
                body: [["필수: 이름, 휴대폰 번호", "선택: 관심 상품 카테고리(인터넷/TV/인터넷+TV)"]],
            },
            {
                title: "보유 및 이용 기간",
                body: ["상담 처리 완료 후 1년까지 보관 후 파기하며, 관련 법령에 보존 의무가 있는 경우 해당 기간 동안 보관합니다."],
            },
            {
                title: "동의 거부 권리 및 불이익",
                body: [
                    "이용자는 개인정보 수집·이용 동의를 거부할 권리가 있습니다. 다만 필수 항목에 동의하지 않을 경우 상담 신청이 제한될 수 있습니다.",
                ],
            },
        ],
    },
    thirdParty: {
        id: "thirdParty",
        modalTitle: "개인정보 제3자 제공 및 활용 동의",
        sections: [
            {
                title: "제공받는 자",
                body: ["결합 상품을 실제로 개통·설치하는 통신사 및 협력 대리점"],
            },
            {
                title: "제공 목적",
                body: ["신청한 인터넷·TV 결합 상품의 상담, 견적 안내 및 개통 절차 진행"],
            },
            {
                title: "제공 항목",
                body: [["이름, 휴대폰 번호, 관심 상품 카테고리"]],
            },
            {
                title: "보유 및 이용 기간",
                body: ["상담 및 개통 처리 완료 후 1년까지 보관 후 파기합니다."],
            },
            {
                title: "동의 거부 권리 및 불이익",
                body: [
                    "이용자는 개인정보 제3자 제공 동의를 거부할 권리가 있습니다. 다만 동의하지 않을 경우 통신사 확인이 필요한 맞춤 혜택 상담이 제한될 수 있습니다.",
                ],
            },
        ],
    },
    marketing: {
        id: "marketing",
        modalTitle: "마케팅 정보 수신 동의",
        sections: [
            {
                title: "수집 및 이용 목적",
                body: ["결합 할인, 이벤트, 신규 상품 등 혜택 정보를 문자(SMS) 및 전화로 안내하기 위해 이용합니다."],
            },
            {
                title: "수집 항목",
                body: [["휴대폰 번호"]],
            },
            {
                title: "보유 및 이용 기간",
                body: ["수신 동의일로부터 동의 철회 시까지 보관하며, 철회 시 지체 없이 파기합니다."],
            },
            {
                title: "동의 거부 권리 및 불이익",
                body: [
                    "본 동의는 선택 사항으로, 동의하지 않아도 상담 신청에는 제한이 없습니다. 동의 이후에도 회사에 연락하여 언제든지 수신을 거부할 수 있습니다.",
                ],
            },
        ],
    },
};

export const AGREEMENT_FOOTER = `문의: ${COMPANY_INFO.name} · ${COMPANY_INFO.phone} · ${COMPANY_INFO.email}`;
