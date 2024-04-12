import React, { useRef, useEffect, useState } from "react";
import "./App.css";
const emotions = [
  "Aggression",
  "Depression",
  "Fixations",
  "Abnormal Flat Speech",
  "Noise Sensitivity",
  "Social Difficulty",
  "Anxiety",
  "Abnormal Posture",
  "Poor Eye Contact",
  "Tics and Fidgets",
];

const colors = [
  "#76579C",
  "#6B69BD",
  "#36A2BD",
  "#5FB2A1",
  "#8DC96D",
  "#BCD188",
  "#F5D861",
  "#EE924F",
  "#D35254",
  "#D740B9",
];

function interpolateColor(color, factor) {
  const { r, g, b } = hexToRgb(color);
  const darken = (1 - factor) ** 0.05; // Cubic darkening for a more noticeable effect
  const newColor = `rgb(${r * darken}, ${g * darken}, ${b * darken})`;
  return newColor;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const PieChart = ({ segments, setSegments, setPercentages }) => {
  const canvasRef = useRef(null);
  const [hoveredRadius, setHoveredRadius] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [fullRadius, setFullRadius] = useState(150);

  //test
  useEffect(() => {
    // Dynamically update fullRadius based on window size or other conditions
    const updateRadius = () => {
      const newRadius = window.innerWidth < 768 ? 150 : 200;
      setFullRadius(newRadius);
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const drawSegment = (
    ctx,
    centerX,
    centerY,
    startRadius,
    outerRadius,
    startAngle,
    endAngle,
    color
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(
      centerX + startRadius * Math.cos(startAngle),
      centerY + startRadius * Math.sin(startAngle)
    );
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.lineTo(
      centerX + startRadius * Math.cos(endAngle),
      centerY + startRadius * Math.sin(endAngle)
    );
    ctx.arc(centerX, centerY, startRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();
  };

  const drawSegmentBorder = (
    ctx,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle
  ) => {
    // CHANGE: Draw borders between segments
    ctx.strokeStyle = "#000"; // Black border
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
  };

  const drawCustomRadiusBorder = (
    ctx,
    centerX,
    centerY,
    startRadius,
    endRadius,
    angle
  ) => {
    // CHANGE: Draw border for custom radius
    ctx.strokeStyle = "#000"; // Black border
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(
      centerX + startRadius * Math.cos(angle),
      centerY + startRadius * Math.sin(angle)
    );
    ctx.lineTo(
      centerX + endRadius * Math.cos(angle),
      centerY + endRadius * Math.sin(angle)
    );
    ctx.stroke();
  };

  const drawLabels = (
    ctx,
    centerX,
    centerY,
    fullRadius,
    emotions,
    segments,
    hoveredSegment,
    hoveredRadius
  ) => {
    ctx.fillStyle = "#000"; // Black text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "14px Arial";
    emotions.forEach((emotion, index) => {
      const startAngle = (index * 2 * Math.PI) / emotions.length;
      const middleAngle = startAngle + Math.PI / emotions.length;
      const labelRadius = fullRadius + 40;
      const x = centerX + labelRadius * Math.cos(middleAngle);
      const y = centerY + labelRadius * Math.sin(middleAngle);

      // Draw the emotion label
      ctx.fillText(emotion, x, y);

      // Determine the radius to use for percentage calculation
      let displayRadius = segments[index];
      if (index === hoveredSegment && hoveredRadius <= fullRadius) {
        displayRadius = hoveredRadius; // Use the live hovered radius
      }

      // Calculate and draw the percentage
      const percent = ((displayRadius / fullRadius) * 100).toFixed(1);
      ctx.fillText(`${percent}%`, x, y + 15);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const drawPieChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emotions.forEach((_, index) => {
        const angle = (index * 2 * Math.PI) / emotions.length;
        const nextAngle = ((index + 1) * 2 * Math.PI) / emotions.length;
        const segmentRadius = segments[index];
        const highlightRadius =
          index === hoveredSegment ? hoveredRadius : segmentRadius;
        drawSegment(
          ctx,
          centerX,
          centerY,
          0,
          fullRadius,
          angle,
          nextAngle,
          "white"
        );
        if (highlightRadius > 0) {
          const colorIntensityFactor = highlightRadius / fullRadius;
          const dynamicColor = interpolateColor(
            colors[index],
            colorIntensityFactor
          );
          drawSegment(
            ctx,
            centerX,
            centerY,
            0,
            highlightRadius,
            angle,
            nextAngle,
            dynamicColor
          );
        }
      });

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, fullRadius, 0, Math.PI * 2);
      ctx.stroke();

      emotions.forEach((_, index) => {
        const angle = (index * 2 * Math.PI) / emotions.length;
        const nextAngle = ((index + 1) * 2 * Math.PI) / emotions.length;
        // CHANGE: Call function to draw segment borders
        drawSegmentBorder(ctx, centerX, centerY, fullRadius, angle, nextAngle);
      });

      // CHANGE: Call function to draw labels
      drawLabels(
        ctx,
        centerX,
        centerY,
        fullRadius,
        emotions,
        segments,
        hoveredSegment,
        hoveredRadius
      );
    };

    drawPieChart();
    console.log();
  }, [segments, hoveredRadius, hoveredSegment]);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const adjustedAngle = angle >= 0 ? angle : angle + 2 * Math.PI;
    const segmentIndex = Math.floor(
      (adjustedAngle / (2 * Math.PI)) * emotions.length
    );
    const distanceFromCenter = Math.sqrt(
      (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2
    );

    if (distanceFromCenter <= centerX) {
      setHoveredSegment(segmentIndex);
      setHoveredRadius(distanceFromCenter);
    } else {
      setHoveredSegment(null);
      setHoveredRadius(null);
    }
  };

  const handleClick = (event) => {
    if (hoveredSegment !== null) {
      // Get the canvas size for radius calculation
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;

      if (hoveredRadius <= fullRadius) {
        // This check ensures that we only update segments within the pie chart
        const newSegments = [...segments];
        newSegments[hoveredSegment] = Math.min(hoveredRadius, centerX); // Update the radius, but do not exceed the pie chart's radius
        setSegments(newSegments);
      }

      if (hoveredSegment !== null && hoveredRadius <= fullRadius) {
        let newPercentages = [...segments];
        newPercentages[hoveredSegment] = (
          (hoveredRadius / fullRadius) *
          100
        ).toFixed(1);
        setPercentages(newPercentages);
      }

      // Reset after updating
      setHoveredSegment(null);
      setHoveredRadius(null);
    }
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={650}
        height={650}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          display: "block",
          margin: "auto",
          background: "white",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default PieChart;
