
// gsap.to('.icon', {
//     x: 200
// });

// gsap.to('#icon', {
//     rotation: 360,
//     x: 100,
//     duration: 2
// });

// gsap.from('#icon2', {
//     rotation: 360,
//     x: -90,
//     duration: 2
// });

// gsap.fromTo("#icon3", {
//     x: -100
// },{
//     rotation: 360,
//     x: 100,
//     duration: 2
// });

// rotation: 회전 각도, x: x축으로 이동, duration: 애니메이션 속도

// let t1 = gsap.timeline();
// t1.to('#icon', {duration: 2, x: -100})
//   .to('#icon2', {duration: 1, y: 200})
//   .to('#icon3', {duration: 3, rotation:360});
//
// gsap.to('#icon', {duration:2, x: 300, backgroundColor: 'black', borderRadius: '20%', border: '5px solid black', ease: 'bounce'})

gsap.set('#icon', {transformOrigin: 'right bottom'});
gsap.to('#icon', {duration: 20, rotation: 360});

let myObject = {rotation: 0};
gsap.to(myObject, {duration:20, rotation: 360, onUpdate: function () {
    console.log(myObject.rotation);
}});

gsap.from('.circle', {duration: 1, opacity:0, y: 'random(-200, 200)', stagger: 0.25});
// stagger -> 리스트 차례대로 애니메이션 진행 가능하게