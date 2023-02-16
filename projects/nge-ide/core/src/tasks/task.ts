export interface ITask {
  readonly text: string;
  end: () => void;
}
