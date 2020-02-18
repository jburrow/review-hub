import { ReviewCommentStore, ReviewCommentEvent, reduceComments } from "monaco-review";

export type FileEditEvent = { type: "edit"; fullPath: string; text: string };
export type FileDeleteEvent = { type: "delete"; fullPath: string, };
export type FileCommentEvent = { type: "comment"; fullPath: string, commentEvents: ReviewCommentEvent[] };
export type FileRenameEvent = {
  type: "rename";
  fullPath: string;
  newFullPath: string;
  text: string;
};
export type FileEvents = FileEditEvent | FileDeleteEvent | FileRenameEvent | FileCommentEvent;

export type VersionControlEvent = {
  type: "commit";
  id?: string,
  author: string;
  events: FileEvents[];
} | {
  type: "reset";
  id?: string;
}

export enum FileStateStatus {
  active = 1,
  deleted = 2
}

export type FileState = {
  history: { fileState: FileStateX, event: VersionControlEvent }[];
} & FileStateX;

export type FileStateX = {
  fullPath: string;
  text: string;
  status: FileStateStatus;
  comments: ReviewCommentStore;
  revision: number;
};

export interface VersionControlState {
  files: Record<string, FileState>;
  version: number;
  events: VersionControlEvent[];
}

function createFileState(
  event: VersionControlEvent,
  fullPath: string,
  text: string,
  prev: FileState,
  status: FileStateStatus,
  comments: ReviewCommentStore,
): FileState {
  const current: FileStateX = {
    fullPath: fullPath,
    status: status,
    text: text,
    revision: prev.revision+1,
    comments: comments || { comments: {} }
  }

  return {
    ...current,
    history: [...prev.history, { event: event, fileState: current }],
  };
}

export function initialVersionControlState(): VersionControlState {
  return { files: {}, version: -1, events: [] };
}

export type VCDispatch = (event: VersionControlEvent) => void;

export function versionControlReducer(
  state: VersionControlState, event: VersionControlEvent,
) {

  switch (event.type) {
    case "reset":
      return initialVersionControlState();

    case "commit":
      const updates: { [fullPath: string]: FileState } = {};
      for (const e of event.events) {
        const prev = (state.files[e.fullPath] || {
          fullPath: null,
          text: null,
          status: FileStateStatus.active,
          history: [],
          comments: { viewZoneIdsToDelete: [], comments: {} },
          revision: -1
        }) as FileState;
        let status = FileStateStatus.active;
        let text = prev.text;
        let comments = prev.comments;
        let nextRevision = prev.revision + 1;

        switch (e.type) {
          case "comment":
            comments = reduceComments(e.commentEvents, comments);
            console.info('comments', comments)
            break;
          case "edit":
            text = e.text;
            break;
          case "delete":
            status = FileStateStatus.deleted;
            text = null;

            break;
          case "rename":
            status = FileStateStatus.deleted;

            updates[e.newFullPath] = createFileState(
              event,
              e.newFullPath,
              e.text || prev.text,
              prev,
              status,
              comments

            );
            break;
        }

        updates[e.fullPath] = createFileState(
          event,
          e.fullPath,
          text,
          prev,
          status,
          comments
        );
      }
      return {
        files: {
          ...state.files,
          ...updates,
        },
        events: [...state.events, event],
        version: state.version + 1
      };
  }
}

export function reduceVersionControl(
  actions: VersionControlEvent[],
  state: VersionControlState = null
) {
  state = state || initialVersionControlState();

  for (const a of actions) {
    state = versionControlReducer(state, a);
  }

  return state;
}
