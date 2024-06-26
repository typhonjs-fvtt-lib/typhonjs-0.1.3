import { linear } from 'svelte/easing';
import { lerp } from '@typhonjs-fvtt/runtime/math/interpolate';
import { fade, slide } from 'svelte/transition';

/**
 * Provides a rotate transition. For options `easing` is applied to the rotate transition. The default easing is
 * linear.
 *
 * Note: that when reversing the transition that time goes from `1 - 0`, so if specific options are applied for
 * rotating out transition then `end` and `initial` are swapped.
 *
 * @param {HTMLElement} node - The transition node.
 *
 * @param {object}      [options] - Optional parameters.
 *
 * @param {number}      [options.delay] - Delay in ms before start of transition.
 *
 * @param {number}      [options.duration] - Total transition length in ms.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easing=linear] - The easing function to apply to the
 *        rotate transition.
 *
 * @param {number}      [options.end=0] - End rotation in degrees.
 *
 * @param {number}      [options.initial=0] - Initial rotation in degrees.
 *
 * @returns {import('svelte/transition').TransitionConfig} Transition config.
 */
function rotate(node, options)
{
   const easingRotate = options.easing ?? linear;

   const initialDeg = options.initial ?? 0;
   const endDeg = options.end ?? 0;

   return {
      delay: options.delay ?? 0,
      duration: options.duration ?? 500,
      easing: linear,
      css: (t) =>
      {
         const rotateT = easingRotate(t);
         return `transform: rotate(${lerp(initialDeg, endDeg, rotateT)}deg)`;
      }
   };
}

/**
 * Combines rotate & fade transitions into a single transition. For options `easing` this is applied to both transitions,
 * however if provided `easingRotate` and / or `easingFade` will take precedence. The default easing is linear.
 *
 * Note: that when reversing the transition that time goes from `1 - 0`, so if specific options are applied for
 * rotating out transition then `end` and `initial` are swapped.
 *
 * @param {HTMLElement} node - The transition node.
 *
 * @param {object}      [options] - Optional parameters.
 *
 * @param {number}      [options.delay] - Delay in ms before start of transition.
 *
 * @param {number}      [options.duration] - Total transition length in ms.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easing=linear] - The easing function to apply to both
 *        slide & fade transitions.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easingFade=linear] - The easing function to apply to
 *        the fade transition.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easingRotate=linear] - The easing function to apply
 *        to the rotate transition.
 *
 * @param {number}      [options.end=0] - End rotation in degrees.
 *
 * @param {number}      [options.initial=0] - Initial rotation in degrees.
 *
 * @returns {import('svelte/transition').TransitionConfig} Transition config.
 */
function rotateFade(node, options)
{
   const easingFade = options.easingFade || options.easing || linear;
   const easingRotate = options.easingRotate || options.easing || linear;

   const fadeTransition = fade(node);

   const initialDeg = options.initial ?? 0;
   const endDeg = options.end ?? 0;

   return {
      delay: options.delay ?? 0,
      duration: options.duration ?? 500,
      easing: linear,
      css: (t) =>
      {
         const fadeT = easingFade(t);
         const rotateT = easingRotate(t);

         return `transform: rotate(${lerp(initialDeg, endDeg, rotateT)}deg); ${fadeTransition.css(fadeT, 1 - fadeT)}`;
      }
   };
}

/**
 * Combines slide & fade transitions into a single transition. For options `easing` this is applied to both transitions,
 * however if provided `easingSlide` and / or `easingFade` will take precedence. The default easing is linear.
 *
 * @param {HTMLElement} node - The transition node.
 *
 * @param {object}      [options] - Optional parameters.
 *
 * @param {number}      [options.delay] - Delay in ms before start of transition.
 *
 * @param {number}      [options.duration] - Total transition length in ms.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easing=linear] - The easing function to apply to both
 *        slide & fade transitions.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easingFade=linear] - The easing function to apply to
 *        the fade transition.
 *
 * @param {import('svelte/transition').EasingFunction}   [options.easingSlide=linear] - The easing function to apply to
 *        the slide transition.
 *
 * @returns {import('svelte/transition').TransitionConfig} Transition config.
 */
function slideFade(node, options)
{
   const fadeEasing = options.easingFade || options.easing || linear;
   const slideEasing = options.easingSlide || options.easing || linear;

   const fadeTransition = fade(node);
   const slideTransition = slide(node);

   return {
      delay: options.delay || 0,
      duration: options.duration || 500,
      easing: linear,
      css: (t) =>
      {
         const fadeT = fadeEasing(t);
         const slideT = slideEasing(t);
         return `${slideTransition.css(slideT, 1 - slideT)}; ${fadeTransition.css(fadeT, 1 - fadeT)}`;
      }
   };
}

/**
 * Converts a Svelte transition to an animation. Both transitions & animations use the same CSS / styles solution and
 * resulting data so wrap the transition function with the signature of an animation.
 *
 * @param {(node: Element, ...rest: any[]) => import('svelte/transition').TransitionConfig} fn -
 *        A Svelte transition function.
 *
 * @returns {(
 *    node: Element,
 *    data: { from: DOMRect, to: DOMRect },
 *    ...rest: any
 * ) => import('svelte/animation').AnimationConfig} - Transition function converted to an animation.
 */
function toAnimation(fn)
{
   return (node, animations, ...rest) => fn(node, ...rest);
}

/**
 * Provides static data useful for handling custom props / options to components that allow dynamic configuration of
 * transitions. This is used in all application shells and components that have configurable transitions.
 *
 * @ignore
 */
class TJSDefaultTransition
{
   static #options = {};

   static #default = () => void 0;

   /**
    * @returns {() => undefined} Default empty transition.
    */
   static get default() { return this.#default; }

   /**
    * @returns {{}} Default empty options.
    */
   static get options() { return this.#options; }
}

export { TJSDefaultTransition, rotate, rotateFade, slideFade, toAnimation };
//# sourceMappingURL=index.js.map
