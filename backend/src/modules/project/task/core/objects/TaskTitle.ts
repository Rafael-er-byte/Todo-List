import LimitExceeded from '../../../../shared/core/errors/LimitExceeded';
import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';
import TaskBusinessRules from '../constants/TaskRules';

export default class TaskTitle extends ValueObject {
  private title!: Text;

  constructor(title: string) {
    super();
    const textTitle = new Text(title);
    if (textTitle.size() > TaskBusinessRules.TITLE_LIMIT_SIZE)
      throw new LimitExceeded('Title size limit exceeded');
      this.title = textTitle;
  }

  public getTitle(): string {
    return this.title.getText();
  }
}
