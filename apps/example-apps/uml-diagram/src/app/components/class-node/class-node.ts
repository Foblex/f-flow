import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IUmlClass } from '../../domain';

@Component({
  selector: 'uml-class-node',
  templateUrl: './class-node.html',
  styleUrls: ['./class-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassNode {
  public readonly umlClass = input.required<IUmlClass>();
  public readonly isHighlighted = input<boolean>(false);
  public readonly isDimmed = input<boolean>(false);
  public readonly isSelected = input<boolean>(false);
  public readonly connectionCount = input<number>(0);

  public readonly classClick = output<string>();

  protected onCardClick(event: Event): void {
    event.stopPropagation();
    this.classClick.emit(this.umlClass().id);
  }

  protected onCardKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (event.target !== event.currentTarget) {
      return;
    }

    if (keyboardEvent.code === 'Space') {
      keyboardEvent.preventDefault();
    }

    this.onCardClick(keyboardEvent);
  }

  protected formatAttribute(attr: { visibility: string; name: string; type: string }): string {
    return `${attr.visibility} ${attr.name}: ${attr.type}`;
  }

  protected formatMethod(method: {
    visibility: string;
    name: string;
    params: string;
    returnType: string;
  }): string {
    return `${method.visibility} ${method.name}(${method.params}): ${method.returnType}`;
  }
}
