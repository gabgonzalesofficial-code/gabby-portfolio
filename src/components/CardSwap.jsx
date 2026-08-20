import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/motion';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  containerClassName = '',
  manual = false,
  onSwap,
  jumpToRef,
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),

    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const swapRef = useRef(() => {});
  const onSwapRef = useRef(onSwap);
  onSwapRef.current = onSwap;

  // Expose jumpTo via callback ref — programmatically brings any card to front
  useEffect(() => {
    if (!jumpToRef) return;
    jumpToRef.current = (targetIndex) => {
      const currentOrder = order.current;
      const posInOrder = currentOrder.indexOf(targetIndex);
      if (posInOrder <= 0) return; // already in front

      // Kill any running animation
      tlRef.current?.kill();
      clearInterval(intervalRef.current);

      // Move target card to front of order
      const newOrder = [targetIndex, ...currentOrder.filter((_, i) => i !== posInOrder)];
      order.current = newOrder;

      // Animate all cards to their new positions
      const total = refs.length;
      const fastDur = 0.4;

      newOrder.forEach((cardIdx, pos) => {
        const el = refs[cardIdx].current;
        if (!el) return;
        const slot = makeSlot(pos, cardDistance, verticalDistance, total);
        // zIndex must use gsap.set (not animatable), position uses gsap.to
        gsap.set(el, { zIndex: slot.zIndex });
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          skewY: skewAmount,
          duration: fastDur,
          ease: 'power2.out',
          force3D: true
        });
      });

      onSwapRef.current?.(targetIndex);
    };

  }, [jumpToRef, cardDistance, verticalDistance, skewAmount, refs]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    if (prefersReducedMotion()) return;

    let animating = false;
    const swap = () => {
      if (order.current.length < 2 || animating) return;
      animating = true;

      const [front, ...rest] = order.current;
      onSwapRef.current?.(rest[0]);
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        animating = false;
      });
    };

    swapRef.current = swap;

    if (manual) {
      onSwapRef.current?.(order.current[0]);
      return undefined;
    }

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);

  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, manual]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
            if (manual) swapRef.current();
          }
        })
      : child
  );

  return (
    <div ref={container} className={`card-swap-container ${containerClassName}`.trim()} style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
