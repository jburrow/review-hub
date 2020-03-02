import {
  ReviewCommentStore,
  ReviewCommentEvent,
  reduceComments
} from "monaco-review";
import { v4 } from "uuid";

export type FileEditEvent = { type: "edit"; fullPath: string; text: string };
export type FileDeleteEvent = { type: "delete"; fullPath: string };
export type FileCommentEvent = {
  type: "comment";
  fullPath: string;
  commentEvents: ReviewCommentEvent[];
};
export type FileRenameEvent = {
  type: "rename";
  fullPath: string;
  oldFullPath: string;
  text: string;
};

export type GeneralComment = {
  type: "general-comment";
  commentEvents: ReviewCommentEvent[];
};

export type FileEvents =
  | FileEditEvent
  | FileDeleteEvent
  | FileRenameEvent
  | FileCommentEvent
  | GeneralComment;

export type VersionControlCommitEvent = {
  type: "commit";
  id?: string;
  author: string;
  events: FileEvents[];
};

export type VersionControlCommitReset = {
  type: "reset";
  id?: string;
};

export type VersionControlEvent =
  | VersionControlCommitEvent
  | VersionControlCommitReset;

export enum FileStateStatus {
  active = 1,
  deleted = 2
}

export type FileState = {
  history: FileStateHistory[];
} & FileStateX;

export interface FileStateHistory {
  fileState: FileStateX;
  event: VersionControlEvent;
}

export type FileStateX = {
  //TODO name bettererer
  fullPath: string;
  text: string;
  status: FileStateStatus;
  commentStore: ReviewCommentStore;
  revision: number;
};

export type Files = Record<string, FileState>;

export interface VersionControlState {
  files: Files;
  commits: Record<string, Files>;
  version: number;
  events: VersionControlEvent[];
  headCommitId: string;
  commentStore: ReviewCommentStore;
}

function createFileState(
  event: VersionControlEvent,
  fullPath: string,
  text: string,
  prev: FileState,
  status: FileStateStatus,
  commentStore: ReviewCommentStore
): FileState {
  const current: FileStateX = {
    fullPath: fullPath,
    status: status,
    text: text,
    revision: prev.revision + 1,
    commentStore: commentStore || { comments: {} }
  };

  return {
    ...current,
    history: [...prev.history, { event: event, fileState: current }]
  };
}

export function initialVersionControlState(): VersionControlState {
  return {
    files: {},
    version: -1,
    events: [],
    commits: {},
    headCommitId: null,
    commentStore: { comments: {} }
  };
}

export type VCDispatch = (event: VersionControlEvent) => void;

export function versionControlReducer(
  state: VersionControlState,
  event: VersionControlEvent
) {
  switch (event.type) {
    case "reset":
      return initialVersionControlState();

    case "commit":
      const updates: { [fullPath: string]: FileState } = {};
      let generateCommentStore = state.commentStore;
      for (const e of event.events) {
        if (e.type === "general-comment") {
          generateCommentStore = reduceComments(
            e.commentEvents,
            generateCommentStore
          );
          continue;
        }

        const prev = (state.files[e.fullPath] || {
          fullPath: null,
          text: null,
          status: FileStateStatus.active,
          history: [],
          commentStore: { comments: {} },
          revision: -1
        }) as FileState;

        let status = FileStateStatus.active;
        let text = prev.text;
        let commentStore = prev.commentStore;

        switch (e.type) {
          case "comment":
            commentStore = reduceComments(e.commentEvents, commentStore);
            console.info("commentStore after reduce", commentStore);

            break;
          case "edit":
            status = FileStateStatus.active;
            text = e.text;

            break;
          case "delete":
            status = FileStateStatus.deleted;
            text = null;

            break;
          case "rename":
            status = FileStateStatus.active;
            text = e.text || prev.text;

            updates[e.oldFullPath] = createFileState(
              event,
              e.oldFullPath,
              "",
              prev,
              FileStateStatus.deleted,
              commentStore
            );

            break;
        }

        updates[e.fullPath] = createFileState(
          event,
          e.fullPath,
          text,
          prev,
          status,
          commentStore
        );
      }

      const files = {
        ...state.files,
        ...updates
      };

      const commitId = event.id || v4();
      const newCommit: Record<string, Files> = {};
      newCommit[commitId] = files;

      return {
        files: files,
        commits: { ...state.commits, ...newCommit },
        events: [...state.events, event],
        version: state.version + 1,
        headCommitId: event.id,
        commentStore: generateCommentStore
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

export function isReadonly(history: FileStateHistory[], revision: number) {
  return history[history.length - 1].fileState.revision !== revision;
}
