// @/app/teamData/page.tsx
export type userDataType = {
  id: string;
  name: string;
  authority: string;
  password: string;
};

// @/app/teamData/page.tsx
export type dbUserDataType = {
  id: number;
  name: string;
  permission: string;
  password: string;
};

// @/components/CommnetDialog.tsx
export type CommentDialogProps = {
  open: boolean;
  comment: string;
  onClose: () => void;
};

// @/components/StatusDialog.tsx
export type StatusDialogProps = {
  open: boolean;
  status: string;
  onClose: () => void;
};

// @/components/HeadBar.tsx
export type AccountType = {
  username: string;
  permission: string;
};

// @/components/LaserCutMachineList.tsx
// @/components/ThreeDPMachineList.tsx
export type MachineListProps = {
  index: number;
};

// @/components/LaserCutMachineList.tsx
export type indRequestForLaserCut = {
  id: number;
  groupname: number;
  machine: number;
  filename: string;
  finalMaterial: string;
  status: string;
  comment: string;
};

// @/components/ThreeDPMachineList.tsx
export type indRequestForThreeDP = {
  id: number;
  groupname: number;
  machine: number;
  loadBearing: boolean;
  filename: string;
  status: string;
  comment: string;
};

// @/components/LaserCutQueueList.tsx
// @/components/LaserCutQueueListForContestant.tsx
export type indRequestForLaserCutQueue = {
  id: number;
  groupname: number;
  filename: string;
  material: string[];
  finalMaterial: string;
  status: string;
  comment: string;
  timeleft: Date;
};

// @/components/LaserCutQueueList.tsx
// @/components/LaserCutQueueListForContestant.tsx
export type broadcastMaterialRequest = {
  id: number;
  finalMaterial: string;
};

// @/components/ThreeDPQueueList.tsx
// @/components/ThreeDPQueueListForContestant.tsx
export type indRequestForThreeDPQueue = {
  id: number;
  groupname: number;
  filename: string;
  loadBearing: boolean;
  material: string[];
  status: string;
  comment: string;
  timeleft: Date;
};

// @/components/LaserCutQueueList.tsx
// @/components/ThreeDPQueueList.tsx
// @/components/LaserCutQueueListForContestant.tsx
// @/components/ThreeDPQueueListForContestant.tsx
// @/components/FinishedDialog.tsx
export type broadcastStatusRequest = {
  id: number;
  status: string;
  timeCreated: Date;
};

// @/components/FinishedDialog.tsx
export type FinishDialogProps = {
  id: number;
  open: boolean;
  groupName: number;
  type: string;
  onClose: () => void;
};

// @/components/LaserReserveDialog.tsx
export type LaserReserveDialogProps = {
  open: boolean;
  group: string;
  material: string[];
  filename: string;
  comment: string;
  onClose: () => void;
};

// @/components/ThreeDPReserveDialog.tsx
export type ThreeDPReserveDialogProps = {
  open: boolean;
  group: string;
  material: string[];
  filename: string;
  comment: string;
  loadBearing: boolean;
  onClose: () => void;
};

export type indRequestForLaserCutQueueForAdmin = {
  id: number;
  groupname: number;
  machine: number;
  filename: string;
  material: string[];
  finalMaterial: string;
  status: string;
  comment: string;
  timeleft: Date;
};

export type indRequestForThreeDPQueueForAdmin = {
  id: number;
  groupname: number;
  machine: number;
  loadBearing: boolean;
  filename: string;
  material: string[];
  status: string;
  comment: string;
  timeleft: Date;
};

export type StatusProps = {
  id: number;
  initialState: string;
  timeStarted: Date;
  type: string;
};

export type indRequestForStatus = {
  id: number;
  timeleft: Date;
  status: string;
};

export type InputProps = {
  placeHolder?: string;
  editable: boolean;
  value?: string;
  type?: string;
  onChange?: (value: string) => void;
};
