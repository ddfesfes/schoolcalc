<script lang="ts">
    import '../styles/page.css';
    import byeolgaramWeights from '../lib/weights/byeolgaram1.json';

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

    let selectedValue: SelectedValue = 'front';
    let semesterValues: SemesterValues = {
        firstSemester: '',
        secondSemester: ''
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

        const firstSemGrades: string = String(semesterValues.firstSemester).split('');
        let totalScore: number = 0;
        let totalWeight: number = 0;
        
        Object.entries(byeolgaramWeights).forEach(([subject, weight], index) => {
            const grade: number = parseInt(firstSemGrades[index]);
            if (!isNaN(grade)) {
                totalScore += grade * (weight as number);
                totalWeight += weight as number;
            }
        });
        
        const finalScore: number = Number((totalScore / totalWeight).toFixed(2));
        console.log(finalScore);
        return finalScore;
    }
</script>

<div class="box">
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

    <button class="calculate-btn" on:click={calculateGrade}>
        계산하기
    </button>

    {#if calculated}
        <div>

        </div>
    {/if}
</div>
