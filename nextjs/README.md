## Next.js 에서의 이미지 최적화
HTML 의 `<img/>` 태그는 개발자가 1. 반응형을 고려해야 하고, 2. 이미지 최적화와 관련된 라이브러리가 별도로 필요로 하고, 3. 뷰포트 영역에 들어갈 때만 이미지를 로딩하도록 설정해야한다.     
이러한 단점을 해결하기 위해, Next.js 에서는 `Image` 컴포넌트를 제공한다.    
해당 컴포넌트를 통해 WebP와 같은 최신 형식으로 이미지 크기를 조정, 최적화 및 제공이 가능하다.     

### Image 컴포넌트 사용하기
1. 외부 도메인 사진을 사용하려면, `next.config.js` 파일에서 도메인을 설정해줘야 한다.
2. 스타일 입히기
   - object-position 과 같은 속성을 입히기 위해서 `fill` 을 사용한다.
   - `fill`을 사용할 시, 꼭 부모 요소에 `position: relative`와 `display: block`을 설정해줘야 한다. 
   - 위 두가지 설정을 하지 않을 경우, 사진이 이상하게 배치됨으로 꼭 주의하기!

## Next.js 에서의 CSS
Next.js는 CSS 모듈을 지원한다. 사용은 `[name].module.css` 로 할 수 있다.   
CSS 모듈은 고유한 클래스 이름을 자동으로 생성하여 CSS 범위를 로컬로 지정한다. 이를 통해 얻을 수 있는 이점은 충돌을 걱정할 필요가 없다는 것이다.   
기존 CSS 와 같은 경우, 다른 파일에서 동일한 class 이름으로 스타일을 설정하면, 스타일이 중첩되어 충돌이 발생한다. CSS 모듈은 이러한 문제를 해결하였다.    
모듈을 사용하려면 `import styles from './[name].module.css` 과 같이 선언해주면 된다.


## Next.js 에서의 사전 렌더링
기본적으로 Next.js 는 모든 페이지를 사전 렌더링 한다. 즉, 클라이언트 측 javascript 에서 모든 작업을 수행하는 대신 미리 각 페이지에 대한 HTML 을 생성한다.   
생성된 각 HTML 은 해당 페이지에 필요한 최소한의 Javascript 코드와 연결된다.   
<img width="673" alt="image" src="https://user-images.githubusercontent.com/74577803/209810012-3b8b4006-1f95-43e4-bc64-ec15604bb989.png">


- Next.js는 javascript 없이 랜더링이 진행된다. 정적 HTML 로 미리 렌더링 하여 JavaScript 를 실행하지 않고도 화면을 볼 수 있다.
- React.js는 사전 렌더링을 하지 않아, JavaScript 를 비활성화 하면 화면을 볼 수 없다.

### 사전 렌더링의 형식
1. 정적 생성: 빌드 시 HTML 을 생성하는 사전 렌더링 방법 -> 미리 렌더링 된 HTML 이 각 요청에서 재사용된다 
   <img width="673" alt="image" src="https://user-images.githubusercontent.com/74577803/209809716-c7a5f152-986b-47d4-8110-bb3d99a9eb24.png">
2. 서버 측 렌더링: 각 요청에서 HTML 을 생성하는 사전 렌더링 방법
   <img width="683" alt="image" src="https://user-images.githubusercontent.com/74577803/209809880-02ba7370-15b8-4f1d-b5c4-b822fad18db6.png">

### 사전 렌더링 형식 선택하기
Next.js 는 사전 렌더링의 형식을 선택할 수 있다.   
- 정적 생성은 페이지에 자주 업데이트 되는 데이터가 표시되고, 페이지 콘텐츠가 모든 요청에서 변경될 수 있을 때 사용
- 서버측 렌더링은 속도는 느려지지만, 미리 렌더링 된 페이지는 항상 최신 상태이다. 즉, 요청이 있을 때마다 데이터를 최신 상태로 유지해야 하는 경우 사용


### 정적 생성 사용 (getStaticProps())
서버 측에서 실행 되기 때문에, 데이터베이스에 직접 쿼리하는 것 또한 가능하다.   
개발 중(`npm run dev`)에는 모든 요청에 실행된다.   
프로덕션 환경에서는 빌드 시 실행된다.   

``` typescript
export async function getStaticProps(){
    const res = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline');
    const productsData = await res.json();

    return { props: {productsData} };
}

export default function Post ({productsData}: any){
    return ( ... );
}
```

### 동적 경로에서 정적 생성 사용
id 값 넘겨줄 때, 타입을 조심해야 한다.

`
error - Error: A required parameter (id) was not provided as a string in getStaticPaths for /post/[id]
`

다음과 같은 에러가 발생할 시, 타입을 String 으로 변환해주었는지 다시 한 번 확인해보아야 한다.

```typescript
export async function getStaticPaths() {
    const res = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    const products = await res.json();

    const paths = products.map((product : any) => ({
        params: { id: product.id.toString()},
    }));

    return {paths, fallback: false};
}

```

### 서버 측 렌더링 (getServerSideProps())
SEO 와 관련이 없는 비공개 사용자별 페이지의 경우, 주로 사용한다.   

```typescript
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```