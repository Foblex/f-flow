#### TOPIC -1-

##### What is a closure? (give a detailed description in your own words) 

Это функция которая знает своё лексическое окружение даже после того как внешний контекст завершил выполнение. 
Замыкания позволяют функции иметь доступ к переменным, которые были определены вне её, сохраняя состояние между вызовами

##### Example

```typescript 
function createCounter() {
     let count = 0;
     return function() {
         count += 1;
     };
 }

const counter = createCounter();
counter();
```
##### Benefits

Преимуществами замыканий является возможность создания приватных переменных и методов, а также сохранение состояния между вызовами функции. 
Также способствуют написанию более чистого кода.

##### How Closures and Garbage Collector are related to each other?

Так как замыкания запоминают своё окружение, они удерживают ссылки на переменные, что мешает их очистке сборщиком мусора, до момента пока замыкание не будет удалено.

##### When did you use closure last time and why?

Несколько дней назад, при доработке своей библиотеки при реализации паттерна "медиатор". https://flow.foblex.com/

```
import { Type } from '@angular/core';
import { FMediator } from './f-mediator';
import { IExecution } from './i-execution';

type Constructor<T = any> = new (...args: any[]) => T;

export function FExecutionRegister<TRequest, TResponse>(requestType: Type<TRequest>) {
  return function (constructor: Constructor<IExecution<TRequest, TResponse>>) {
    FMediator.registerPipeline(requestType, constructor, false);
  };
}
```

#### TOPIC -2-

##### In a garbage-collected language like JavaScript, how are memory leaks possible?

Незавершённые таймеры и обработчики событий, замыкания, удерживающие ссылки. Если присвоить дом элемент переменной, а потом удалить этот элемент, то ссылка на него останется в памяти.

##### Please explain in your own words what the memory leak is.

Когда программа использует память, но не освобождает её после того как она стала ненужной.

##### Try to describe the low-level mechanics of a memory leak.

Например в C# сборка мусора происходит по принципу "поколений". Когда объект создаётся, он помещается в поколение 0. Если объект проживает достаточно долго, он перемещается в поколение 1 и так далее. Если объект не используется, он помечается как "мусор" и сборщик мусора удаляет его из памяти. Но если объект ссылается на другой объект, который в свою очередь ссылается на первый объект, то они оба останутся в памяти, так как сборщик мусора не сможет удалить их.

##### Give an example from your work situation (optional).

