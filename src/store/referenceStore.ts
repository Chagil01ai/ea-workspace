// src/store/referenceStore.ts
import type { ExamPart } from "./questionStore";
import referenceDocsRaw from "../data/referenceDocs.json";
import type {
  ReferenceDoc,
  ReferenceAnnotation,
} from "../domain/models/reference";

const REFS_ANNOTATIONS_KEY = "eaReferenceAnnotations_v1";

const REFERENCE_DOCS: ReferenceDoc[] = referenceDocsRaw as ReferenceDoc[];

function loadAnnotationsRaw(): ReferenceAnnotation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REFS_ANNOTATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReferenceAnnotation[];
  } catch {
    return [];
  }
}

function saveAnnotationsRaw(annotations: ReferenceAnnotation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      REFS_ANNOTATIONS_KEY,
      JSON.stringify(annotations)
    );
  } catch {
    // ignore
  }
}

// ---------- Docs ----------

export function getAllReferenceDocs(): ReferenceDoc[] {
  return REFERENCE_DOCS;
}

export function getReferenceDocsByPart(
  part: ExamPart | "ALL"
): ReferenceDoc[] {
  if (part === "ALL") return REFERENCE_DOCS;
  return REFERENCE_DOCS.filter((doc) => doc.parts.includes(part));
}

export function searchReferenceDocs(
  query: string,
  part: ExamPart | "ALL" = "ALL"
): ReferenceDoc[] {
  const docs = getReferenceDocsByPart(part);
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return docs;

  return docs.filter((doc) => {
    const haystack = `${doc.title} ${doc.refCode ?? ""} ${
      doc.description ?? ""
    }`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

export function findReferenceDocById(id: string): ReferenceDoc | undefined {
  return REFERENCE_DOCS.find((d) => d.id === id);
}

// ---------- Annotations ----------

export function getAnnotationsForDoc(docId: string): ReferenceAnnotation[] {
  const all = loadAnnotationsRaw();
  return all.filter((a) => a.docId === docId);
}

export function addAnnotation(params: {
  docId: string;
  note: string;
  tags?: string[];
  linkedTopicIds?: string[];
  linkedQuestionIds?: string[];
}): ReferenceAnnotation {
  const nowIso = new Date().toISOString();
  const annotation: ReferenceAnnotation = {
    id: crypto.randomUUID(),
    docId: params.docId,
    page: undefined,
    selectionText: undefined,
    note: params.note.trim(),
    createdAt: nowIso,
    updatedAt: nowIso,
    tags: params.tags ?? [],
    linkedTopicIds: params.linkedTopicIds ?? [],
    linkedQuestionIds: params.linkedQuestionIds ?? [],
  };

  const all = loadAnnotationsRaw();
  all.push(annotation);
  saveAnnotationsRaw(all);

  return annotation;
}

export function deleteAnnotation(id: string): void {
  const all = loadAnnotationsRaw();
  const filtered = all.filter((a) => a.id !== id);
  saveAnnotationsRaw(filtered);
}

export function getAllAnnotations(): ReferenceAnnotation[] {
  return loadAnnotationsRaw();
}

export function replaceAllAnnotations(annotations: ReferenceAnnotation[]): void {
  saveAnnotationsRaw(annotations);
}
