import { Delaunay } from 'd3';

export function background(ctx, stageSize) {
    const points = Array.from({ length: 500 }, () => [
        Math.random() * stageSize.width,
        Math.random() * stageSize.height,
    ]);

    points.push(
        [-50, -50],
        [stageSize.width + 50, 0],
        [0, stageSize.height + 50],
        [stageSize.width + 50, stageSize.height + 50]
    );

    // 들로네 삼각분할 실행
    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles;

    function makeRandomColor(weightA = 1) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        const a = (Math.random() / 10) * weightA;

        return `rgba(${r},${g},${b}, ${a})`;
        //return `rgba(255, 255, 255, ${a})`;
    }

    // 삼각형 그리기
    function drawTriangles() {
        ctx.lineWidth = 1;
        for (let i = 0; i < triangles.length; i += 3) {
            const [p1, p2, p3] = [
                points[triangles[i]],
                points[triangles[i + 1]],
                points[triangles[i + 2]],
            ];
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 5;
            const weightA = (p1[0] + p2[0] + p3[0]) / 3 / stageSize.width;
            ctx.strokeStyle = `rgba(255, 255, 0, ${0.1 * weightA ** 2})`;
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.closePath();
            ctx.fillStyle = makeRandomColor(
                (p1[0] + p2[0] + p3[0]) / 3 / stageSize.width
            );
            ctx.fill();
            ctx.stroke();
        }
    }

    // 점 그리기
    function drawPoints() {
        ctx.fillStyle = 'red';
        points.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    return { drawPoints, drawTriangles };
}
