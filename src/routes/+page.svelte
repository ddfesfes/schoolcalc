<script lang="ts">
    import subjectData from '$lib/typesData/subject.json';
    import { findNearValues, type ValueInfo } from '$lib/utils/findNearValues';

    import '../styles/page.css';
    import byeolgaramWeights from '$lib/weights/byeolgaram1.json';

    type SemesterID = 'firstSemester' | 'secondSemester';
    type SelectedValue = 'front' | 'back';

    interface SemesterValues {
        firstSemester: string;
        secondSemester: string;
    }

    interface SemesterItem {
        label: string;
        id: SemesterID;
    }

    let calculated: boolean = false;
    let calculatedGrade: number = 0;
    let nearValues: ValueInfo[] = [];
    
    let schools: Array<{univ: string, department: string, grade: number}> = [];
    $: {
        try {
            if (nearValues?.length > 0) {
                schools = nearValues
                    .filter(item => item && item.university && item.department && item.value)
                    .map(item => ({
                        univ: item.university,
                        department: item.department,
                        grade: item.value
                    }));
            } else {
                schools = [];
            }
        } catch (error) {
            console.error('Error processing nearValues:', error);
            schools = [];
        }
    }

    let selectedValue: SelectedValue = 'front';
    let semesterValues: SemesterValues = {
        firstSemester: '',
        secondSemester: ''
    };

    const univNameBind: { [key: string]: string } = {
        '서울대학교': 'seoul',
        '연세대학교': 'yonsei',
        '고려대학교': 'korea',
        '서강대학교': 'sogang',
        '성균관대학교': 'skku',
        '한양대학교': 'hanyang',
        '중앙대학교': 'cau',
        '경희대학교': 'kyunghee',
        '한국외국어대학교': 'hufs',
        '서울시립대학교': 'uos',
        '건국대학교': 'konkuk',
        '동국대학교': 'dongguk',
        '홍익대학교': 'hongik'
    };

    const semesterList: SemesterItem[] = [
        {
            label: '1학년 1학기',
            id: 'firstSemester'
        },
        {
            label: '1학년 2학기',
            id: 'secondSemester'
        }
    ];

    function getPlaceholder(semesterId: SemesterID, selectedValue: SelectedValue): string {
        const firstSemText = '등급 입력(ex: 1111111 | 수-영-국-과-사-한-한문)';
        const secondSemText = '등급 입력(ex: 1111111 | 수-영-국-과-사-한-기가)';
        
        if (selectedValue === 'front') {
            return semesterId === 'firstSemester' ? firstSemText : secondSemText;
        } else {
            return semesterId === 'firstSemester' ? secondSemText : firstSemText;
        }
    }

    function inputKeyPressed(evt: KeyboardEvent): void {
        const key = evt.key;
        const input = evt.target as HTMLInputElement;
        
        if (!/[1-9]/.test(key) && key !== 'Backspace') {
            evt.preventDefault();
            return;
        }

        // TODO: 추후 더 많은 학교 지원 시 length 체크의 기준을 json의 key 갯수로 변경
        if (input.value.length >= 7 && key !== 'Backspace') {
            evt.preventDefault();
        }
    }

    function calculateGrade(): void | number {
        if (!semesterValues.firstSemester || !semesterValues.secondSemester || 
            semesterValues.firstSemester.length < 7 || semesterValues.secondSemester.length < 7) {
            return; // TODO: 등급이 다 채워지지 않음 오류 전송
        }

        const firstSemGrades: string[] = String(semesterValues.firstSemester).split('');
        const secondSemGrades: string[] = String(semesterValues.secondSemester).split('');
        let totalScore: number = 0;
        let totalWeight: number = 0;
        
        Object.entries(byeolgaramWeights).forEach(([subject, weight], index) => {
            const grade: number = parseInt(firstSemGrades[index]);
            const secondGrade: number = parseInt(secondSemGrades[index]);
            if (!isNaN(grade) && !isNaN(secondGrade)) {
                totalScore += grade * (weight as number);
                totalScore += secondGrade * (weight as number);
                totalWeight += (weight as number) * 2;
            }
        });
        
        const finalScore: number = Number((totalScore / totalWeight).toFixed(2));
        calculatedGrade = finalScore;
        nearValues = findNearValues(subjectData, finalScore);
        calculated = true;
        return finalScore;
    }
</script>
<div class="box">
{#if !calculated}
<h1 class="title">내신 등급 계산기</h1>

<div class="custom-select">
    <select bind:value={selectedValue}>
        <option value="front">앞반</option>
        <option value="back">뒷반</option>
    </select>
</div>

<div id="inputs">
    {#each semesterList as semester}
        <div class="input-wrapper">
            <label for={semester.id} class="label">{semester.label}</label>
            <div class="input-container">
                <input
                    id={semester.id}
                    type="number"
                    on:keypress={inputKeyPressed}
                    placeholder={getPlaceholder(semester.id, selectedValue)}
                    bind:value={semesterValues[semester.id]}
                />
                {#if semesterValues[semester.id]}
                    <button 
                        class="delete-btn"
                        on:click={() => semesterValues[semester.id] = ''}>
                        ×
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>

<button class="calculate-btn" on:click={() => calculateGrade()}>
    계산하기
</button>
{:else}
<div class="result-section">
    <div class="result-text">
        당신의 전과목 내신 점수는...<span class="result-score">{calculatedGrade}</span>
    </div>

    <div class="grade-boxes">
        <div class="grade-category">
            <div class="category-header">
                <span class="category-title">교과</span>
                <a href="" class="more-info">자세히보기 ▶</a>
            </div>
            <div class="grade-circles">
                {#each schools as school}
                    <div class="grade-item">
                        <div class="align-left">
                            <img 
                                src="/univIcons/{univNameBind[school.univ]}.svg"
                                alt="{school.univ} 로고" 
                                class="univ-icon"
                             />
                            <div class="school-name">{school.univ}</div>
                            <div class="department-name">{school.department}</div>
                         </div>
                         <div class={`grade-value ${school.grade <= calculatedGrade ? 'red' : ''}`}>{school.grade}</div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="grade-category">
            <div class="category-header">
                <span class="category-title">학종</span>
                <a href="" class="more-info">자세히보기 ▶</a>
            </div>
            <div class="grade-circles">
                {#each schools as school}
                    <div class="grade-item">
                        <img 
                            src="/univIcons/{univNameBind[school.univ]}.svg" 
                            alt="{school.univ} 로고" 
                            class="univ-icon"
                        />
                        <div class="school-name">{school.univ}</div>
                        <div class="department-name">{school.department}</div>
                        <div class={`grade-value ${school.grade <= calculatedGrade ? 'red' : ''}`}>{school.grade}</div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}
</div>
