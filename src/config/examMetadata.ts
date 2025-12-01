// src/config/examMetadata.ts
import type { ExamPart } from "../store/questionStore";

export type ExamSectionId =
  | "P1_SEC1_PRELIM_TAXPAYER_DATA"
  | "P1_SEC2_INCOME_ASSETS"
  | "P1_SEC3_DEDUCTIONS_CREDITS"
  | "P1_SEC4_TAXATION"
  | "P1_SEC5_ADVISING"
  | "P1_SEC6_SPECIALIZED_RETURNS"
  | "P2_SEC1_BUSINESS_ENTITIES"
  | "P2_SEC2_BUSINESS_TAX_PREP"
  | "P2_SEC3_SPECIALIZED_RETURNS"
  | "P3_SEC1_PRACTICES_PROCEDURES"
  | "P3_SEC2_REPRESENTATION_IRS"
  | "P3_SEC3_SPECIFIC_REPRESENTATION"
  | "P3_SEC4_FILING_PROCESS";

export interface ExamSectionMeta {
  id: ExamSectionId;
  part: ExamPart;
  label: string;
  /**
   * Number of scored questions on the real SEE
   * (out of 85 scored questions). From study guides.
   */
  scoredQuestions: number;
  /**
   * Recommended number of questions in a full
   * 100-question simulated exam for this section.
   * This can be derived; we include it here for convenience.
   */
  recommendedQuestions: number;
  /**
   * Fraction of scored questions (0–1).
   */
  weight: number;
}

export interface ExamPartMeta {
  part: ExamPart;
  label: string;
  scoredTotal: number; // always 85
  fullExamQuestions: number; // usually 100
  sections: ExamSectionMeta[];
}

const FULL_EXAM_QUESTIONS = 100;

// helper to compute weight + recommended count
function buildSection(
  id: ExamSectionId,
  part: ExamPart,
  label: string,
  scoredQuestions: number,
  scoredTotal: number
): ExamSectionMeta {
  const weight = scoredQuestions / scoredTotal;
  const recommended = Math.round(weight * FULL_EXAM_QUESTIONS);
  return {
    id,
    part,
    label,
    scoredQuestions,
    recommendedQuestions: recommended,
    weight,
  };
}

export const EXAM_METADATA: Record<ExamPart, ExamPartMeta> = {
  PART1_INDIVIDUALS: {
    part: "PART1_INDIVIDUALS",
    label: "Part 1 – Individuals",
    scoredTotal: 85,
    fullExamQuestions: FULL_EXAM_QUESTIONS,
    sections: [
      buildSection(
        "P1_SEC1_PRELIM_TAXPAYER_DATA",
        "PART1_INDIVIDUALS",
        "Section 1 – Preliminary Work and Taxpayer Data",
        14,
        85
      ),
      buildSection(
        "P1_SEC2_INCOME_ASSETS",
        "PART1_INDIVIDUALS",
        "Section 2 – Income and Assets",
        17,
        85
      ),
      buildSection(
        "P1_SEC3_DEDUCTIONS_CREDITS",
        "PART1_INDIVIDUALS",
        "Section 3 – Deductions and Credits",
        17,
        85
      ),
      buildSection(
        "P1_SEC4_TAXATION",
        "PART1_INDIVIDUALS",
        "Section 4 – Taxation",
        15,
        85
      ),
      buildSection(
        "P1_SEC5_ADVISING",
        "PART1_INDIVIDUALS",
        "Section 5 – Advising the Individual Taxpayer",
        11,
        85
      ),
      buildSection(
        "P1_SEC6_SPECIALIZED_RETURNS",
        "PART1_INDIVIDUALS",
        "Section 6 – Specialized Returns for Individuals",
        11,
        85
      ),
    ],
  },

  PART2_BUSINESS: {
    part: "PART2_BUSINESS",
    label: "Part 2 – Businesses",
    scoredTotal: 85,
    fullExamQuestions: FULL_EXAM_QUESTIONS,
    sections: [
      buildSection(
        "P2_SEC1_BUSINESS_ENTITIES",
        "PART2_BUSINESS",
        "Section 1 – Business Entities and Considerations",
        30,
        85
      ),
      buildSection(
        "P2_SEC2_BUSINESS_TAX_PREP",
        "PART2_BUSINESS",
        "Section 2 – Business Tax Preparation",
        37,
        85
      ),
      buildSection(
        "P2_SEC3_SPECIALIZED_RETURNS",
        "PART2_BUSINESS",
        "Section 3 – Specialized Returns and Taxpayers",
        18,
        85
      ),
    ],
  },

  PART3_REPRESENTATION: {
    part: "PART3_REPRESENTATION",
    label: "Part 3 – Representation, Practice & Procedures",
    scoredTotal: 85,
    fullExamQuestions: FULL_EXAM_QUESTIONS,
    sections: [
      buildSection(
        "P3_SEC1_PRACTICES_PROCEDURES",
        "PART3_REPRESENTATION",
        "Section 1 – Practices and Procedures",
        26,
        85
      ),
      buildSection(
        "P3_SEC2_REPRESENTATION_IRS",
        "PART3_REPRESENTATION",
        "Section 2 – Representation before the IRS",
        25,
        85
      ),
      buildSection(
        "P3_SEC3_SPECIFIC_REPRESENTATION",
        "PART3_REPRESENTATION",
        "Section 3 – Specific Types of Representation",
        20,
        85
      ),
      buildSection(
        "P3_SEC4_FILING_PROCESS",
        "PART3_REPRESENTATION",
        "Section 4 – Completion of the Filing Process",
        14,
        85
      ),
    ],
  },
};
