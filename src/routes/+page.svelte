<link rel="stylesheet" as="style" crossorigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<script>
    import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    let grade = 2;
</script>

<div>
    <h1 class="font-bold">내신 등급 계산기</h1>
    <Button class="text-black">
        Dropdown radio<ChevronDownOutline class="w-6 h-6 ms-2 text-black" />
    </Button>
    <Dropdown class="w-44 p-3 space-y-3 text-sm">
        <li>
            <Radio name="group1" bind:group={grade} value={1}>앞반</Radio>
        </li>
        <li>
            <Radio name="group1" bind:group={grade} value={2}>뒷반</Radio>
        </li>
    </Dropdown>
</div>

<style>
    :root {
        font-family: Pretendard;
    }
</style>