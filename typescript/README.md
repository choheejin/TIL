## 타입스크립트 기본 타입
Boolean, Number, String, Object, Array, Tuple, Enum, Any, Void, Null, Undefined, Never   

1. String
```typescript
let str: string = 'hi';
```
2. Number
```typescript
let num: number = 10;
```
3. Boolean
```typescript
let isLoggedIn: boolean = false;
```
4. Array
- 타입이 배열인 경우, 간단하게 아래와 같이 선언
````typescript
let arr: number[] = [1,2,3];
````
- 혹은 아래와 같이 제네릭을 사용한다.
```typescript
let arr: Array<number> = [1,2,3];
```
5. Tuple
튜플은 배열의 길이가 고정되고, 각 요소의 타입이 지정되어 있는 배열형식을 의미한다.
```typescript
let arr: [string, number] = ['hi', 10];
```
> 만약 정의하지 않은 타입, 인덱스로 접근할 경우, 에러가 발생한다.
6. Enum
특정 값들의 집합을 의미한다.
```typescript
enum Avengers { Capt, IronMan, Thor }
let hero1 : Avengers = Avengers.Capt;
let hero2 : Avengers = Avengers[0];

enum Avengers2 { Capt = 2, IronMan, Thor }
let hero3 : Avengers2 = Avengers2[2]; // Capt
let hero4 : Avengers2 = Avengers2[4]; // Thor
```
7. Any
모든 타입에 대해서 허용한다는 의미를 가진다.
```typescript
let str: any = 'hi';
let num: any = 10;
let arr: any = ['a', 2, true];
```
8. Void
변수에는 undefined 와 null 만 할당하고, 함수에는 반환값을 설정할 수 없는 타입이다.
```typescript
let unuseful: void = undefined;
function notuse(): void {
    console.log('notuse');
}
```
9. Never
함수의 끝에 절대 도달하지 않는다는 의미를 가진 타입이다.

## 함수
함수의 파라미터(매개변수) 타입, 함수의 반환 타입, 함수의 구조 타입에 대해서 알아보도록 하자.

### 함수의 기본적인 타입 선언
```typescript
function sum(a: number, b: number): number {
  return a + b;
}
```
함수의 반환 값에 타입을 정하지 않았을 때는 void 라도 사용하자.

### 함수의 인자
함수의 인자는 모두 필수값으로 간주한다.   
정의된 매개변수의 갯수만큼 인자를 넘기지 않아도 된다면, `?`를 이용한다.
```typescript
function sum(a: number, b?: number): number {
  return a + b;
}

sum(10, 20); // 30
sum(10, 20, 30); // error, too many parameters
sum(10); // 타입 에러 없음
```

### REST 문법이 적용된 매개변수
```typescript
function sum(a: number, ...nums: number[]): number {
  let totalOfNums = 0;
  for (let key in nums) {
    totalOfNums += nums[key];
  }
  return a + totalOfNums;
}
```

## 인터페이스
인터페이스는 상호 간에 정의한 약속 혹은 규칙을 의미한다.

### 옵션 속성
속성을 선택적으로 적용할 수 있다.   
```typescript
interface CraftBeer {
    name: string;
    hop?: number;
}
let myBeer = {
    name: 'Saporo'
}
function brewBeer(beer: CraftBeer) {
    console.log(beer.name);
}
brewBeer(myBeer);
```

### 읽기 전용 속성
객체를 처음 생성할 때만 값을 할당하고 그 이후에는 변경할 수 없는 속성을 의미한다.
```typescript
interface CraftBeer {
    readonly brand: string;
}
let myBeer: CraftBeer = {
    brand: 'Belgian Monk'
};
myBeer.brand = 'Korean Carpenter'; // error!
```

### 읽기 전용 배열
배열을 선언할 때 `ReadonlyArray<T>` 타입을 사용하면 읽기 전용 배열을 생성할 수 있다.
```typescript
let arr: ReadonlyArray<number> = [1, 2, 3];
arr.splice(0,1); // error
arr.push(4); // error
arr[0] = 100; // error
```

### 인터페이스 확장
여러 인터페이스를 상속받아 사용할 수 있다.
```typescript
interface Person {
  name: string;
}
interface Drinker {
  drink: string;
}
interface Developer extends Person, Drinker {
  skill: string;
}
let fe = {} as Developer;
fe.name = 'josh';
fe.skill = 'TypeScript';
fe.drink = 'Beer';
```

## 제네릭
타입이 마치 함수의 파라미터처럼 사용하는 것을 의미한다.
```typescript
function getText<T>(text: T): T {
  return text;
}

getText<string>('hi');
getText<number>(10);
getText<boolean>(true);
```

### 객체의 속성을 제약하는 방법
제네릭을 선언할 때 `<O extends keyof T>` 부분에서 첫번째 인자로 받는 객체에 없는 속성들은 접근할 수 없게끔 제한한다.
```typescript
function getProperty<T, O extends keyof T>(obj: T, key: O) {
  return obj[key];  
}

let obj = { a: 1, b: 2, c: 3 };

getProperty(obj, "a"); // okay
getProperty(obj, "z"); // error: "z"는 "a", "b", "c" 속성에 해당하지 않습니다.
```

## 타입 별칭
특정 타입이나 인터페이스를 참조할 수 있는 타입 변수를 의미한다.   
새로운 타입 값을 하나 생성하는 것이 아니라, 정의한 타입에 대해 나중에 쉽게 참고할 수 있게 이름을 부여하는 것과 동일하다.
```typescript
type MyName = string;
const name: MyName = 'capt';
```

**타입 별칭은 인터페이스와 달리 확장이 불가능하다.**
