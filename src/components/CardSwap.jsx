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
          ease: 'elastic.out(0.5,0.75)',
          durDrop: 1.2,
          durMove: 1.0,
          durReturn: 1.0,
          promoteOverlap: 0.7,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.4,
          durMove: 0.4,
          durReturn: 0.4,
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
  const animatingRef = useRef(false);
  const jumpCooldownRef = useRef(false);

  // Expose jumpTo via callback ref — programmatically brings any card to front
  useEffect(() => {
    if (!jumpToRef) return;
    jumpToRef.current = (targetIndex) => {
      const currentOrder = order.current;
      const posInOrder = currentOrder.indexOf(targetIndex);
            if (posInOrder <= 0) {  return; }

      // Kill any running animation and reset animating flag
      tlRef.current?.kill();
      clearInterval(intervalRef.current);
      animatingRef.current = false;

      // Move target card to front, remaining cards in ascending order
      // starting from the NEXT project so swaps continue forward
      const remaining = currentOrder.filter((idx) => idx !== targetIndex).sort((a, b) => a - b);
      const nextStart = remaining.findIndex((idx) => idx > targetIndex);
      const reordered = nextStart > 0
        ? [...remaining.slice(nextStart), ...remaining.slice(0, nextStart)]
        : remaining;
      const newOrder = [targetIndex, ...reordered];
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

      // Prevent next swap() from firing — user just jumped, they should
      // see the new card before it auto-advances
      jumpCooldownRef.current = true;
      setTimeout(() => { jumpCooldownRef.current = false; }, 2000);

      onSwapRef.current?.(targetIndex);
    };

  }, [jumpToRef, cardDistance, verticalDistance, skewAmount, refs]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    if (prefersReducedMotion()) return;

    const swap = () => {
      if (order.current.length < 2 || animatingRef.current || jumpCooldownRef.current) {  return; }
      animatingRef.current = true;

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
          `promote+=${i * 0.1}`
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
        animatingRef.current = false;
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
            if (manual) {
              jumpCooldownRef.current = false;
                            swapRef.current();
            }
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
