import { cubicOut } from "svelte/easing";

/**
 * `axis` (`x` | `y`, default `y`) — the axis of motion along which the transition occurs
 */
export function horizontalSlide(
  node: any,
  { delay = 0, duration = 400, easing = cubicOut, axis = "x" } = {}
) {
  const style: any = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = Number.parseFloat(style[primary_property]);
  const secondary_properties =
    axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => `${e[0].toUpperCase()}${e.slice(1)}`
  );
  const padding_start_value = Number.parseFloat(
    style[`padding${capitalized_secondary_properties[0]}`]
  );
  const padding_end_value = Number.parseFloat(
    style[`padding${capitalized_secondary_properties[1]}`]
  );
  const margin_start_value = Number.parseFloat(
    style[`margin${capitalized_secondary_properties[0]}`]
  );
  const margin_end_value = Number.parseFloat(
    style[`margin${capitalized_secondary_properties[1]}`]
  );
  const border_width_start_value = Number.parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = Number.parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t: any) =>
      `overflow: hidden;opacity: ${
        Math.min(t * 20, 1) * opacity
      };${primary_property}: ${t * primary_property_value}px;padding-${
        secondary_properties[0]
      }: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${
        t * padding_end_value
      }px;margin-${secondary_properties[0]}: ${
        t * margin_start_value
      }px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${
        secondary_properties[0]
      }-width: ${t * border_width_start_value}px;border-${
        secondary_properties[1]
      }-width: ${t * border_width_end_value}px;`,
  };
}

/**
 * `direction` (`block` | `inline`, default `block`) — direction along which the transition occurs (For left-to-right writing systems like English `block` corresponds to a vertical and `inline` to a horizontal slide transition)
 */
export function logicalPropertiesHorizontalSlide(
  node: any,
  { delay = 0, duration = 400, easing = cubicOut, direction = "block" } = {}
) {
  const style: any = getComputedStyle(node);
  const opacity: any = +style.opacity;

  const capitalized_logical_property: any = `${direction[0].toUpperCase()}${direction.slice(
    1
  )}`;

  const size_value: any = Number.parseFloat(style[`${direction}Size`]);
  const padding_start_value: any = Number.parseFloat(
    style[`padding${capitalized_logical_property}Start`]
  );
  const padding_end_value: any = Number.parseFloat(
    style[`padding${capitalized_logical_property}End`]
  );
  const margin_start_value: any = Number.parseFloat(
    style[`margin${capitalized_logical_property}Start`]
  );
  const margin_end_value: any = Number.parseFloat(
    style[`margin${capitalized_logical_property}End`]
  );
  const border_width_start_value: any = Number.parseFloat(
    style[`border${capitalized_logical_property}StartWidth`]
  );
  const border_width_end_value: any = Number.parseFloat(
    style[`border${capitalized_logical_property}EndWidth`]
  );

  return {
    delay,
    duration,
    easing,
    css: (t: any) =>
      `overflow: hidden;opacity: ${
        Math.min(t * 20, 1) * opacity
      };${direction}-size: ${t * size_value}px;padding-${direction}-start: ${
        t * padding_start_value
      }px;padding-${direction}-end: ${
        t * padding_end_value
      }px;margin-${direction}-start: ${
        t * margin_start_value
      }px;margin-${direction}-end: ${
        t * margin_end_value
      }px;border-${direction}-start-width: ${
        t * border_width_start_value
      }px;border-${direction}-start-width: ${t * border_width_end_value}px;`,
  };
}
