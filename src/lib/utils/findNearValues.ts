interface UniversityData {
    [university: string]: {
        [department: string]: string;
    };
}

export interface ValueInfo {
    university: string;
    department: string;
    value: number;
}

export function findNearValues(data: UniversityData, targetValue: number, count: number = 2): ValueInfo[] {
    const allValues: ValueInfo[] = Object.entries(data).flatMap(([university, departments]) => 
        Object.entries(departments)
            .filter(([_, value]) => {
                const numValue = parseFloat(value);
                return value !== "0" && value !== "0.0" && numValue > 0;
            })
            .map(([department, value]) => ({
                university,
                department,
                value: parseFloat(value)
            }))
    );

    // 목표값보다 작은 값들 정렬
    const allLowerValues = allValues
        .filter(v => v.value < targetValue)
        .sort((a, b) => b.value - a.value);
    
    // 목표값보다 큰 값들 정렬
    const allHigherValues = allValues
        .filter(v => v.value > targetValue)
        .sort((a, b) => a.value - b.value);
    
    let lowerValues = allLowerValues.slice(0, count);
    let higherValues = allHigherValues.slice(0, count);

    // 부족한 값 보충
    const lowerShortage = count - lowerValues.length;
    const higherShortage = count - higherValues.length;

    if (lowerShortage > 0 && allHigherValues.length > count) {
        // lower가 부족하면 higher에서 더 가져옴
        higherValues = allHigherValues.slice(0, count + lowerShortage);
    }
    
    if (higherShortage > 0 && allLowerValues.length > count) {
        // higher가 부족하면 lower에서 더 가져옴
        lowerValues = allLowerValues.slice(0, count + higherShortage);
    }

    const result = [...lowerValues, ...higherValues].sort((a, b) => a.value - b.value);
    return result;
} 