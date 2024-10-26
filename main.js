// Time Function
const getTime = (time) => {
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minutes = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hours ${minutes} minutes ${remainingSecond}  second ago`
}
// Load Category
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(err => console.log(err))
}
// Load Videos
const loadVideos = (searchText = '') => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(err => console.log(err))
}
// Load Details
const loadDetails = (videoId) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
        .then(res => res.json())
        .then(data => displayDetails(data.video))
}

const categoriesVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
        removeId()
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add('bg-red-500')
        activeBtn.classList.add('text-white')
        displayVideos(data.category)
    })
}
const removeId = () => {
    const buttons = document.getElementsByClassName('btn-category');
    for (let btn of buttons) {
        btn.classList.remove('bg-red-500')
        btn.classList.remove('text-white')
    }
}
// Display Details
const displayDetails = (details) => {
    const modalBox = document.getElementById('modal-box');
    modalBox.innerHTML = `
        <div>
            <img src=${details.thumbnail} class="w-full">
        </div>
        <p>${details.description}</p>
        <div class="modal-action">
        <form method="dialog">
            <button class="btn">Close</button>
        </form>
        </div>
    `
   document.getElementById('showMyModal').click()
}
// Display Category
const displayCategories = (categories) => {
    const categoriesButtons = document.getElementById('category')
    categories.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <button class="btn btn-category" id="btn-${item.category_id}" onclick="categoriesVideos(${item.category_id})">${item.category}</button>
        `;
        categoriesButtons.appendChild(div)
    })
}
// Display Videos
const displayVideos = (videos) => {
    const allVideos = document.getElementById('videos');
    allVideos.innerHTML = '';
    if (videos.length === 0) {
        allVideos.classList.remove('grid')
        allVideos.innerHTML = `
            <div class="text-center">
                <img src="assets/icon.png" class="mx-auto">
                <h2 class="font-bold text-xl mt-3">No Content Here in this Category</h2>
            </div>
        `
        return;
    }else{
        allVideos.classList.add('grid')
    }
    videos.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <figure class="h-52 relative">
              <img src=${item.thumbnail} class="w-full h-full object-cover rounded-t-2xl">
              ${item.others.posted_date?.length === 0 ? '' : `<span class="absolute bottom-2 right-2 rounded px-1 text-xs bg-black text-white">${getTime(item.others.posted_date)}</span>`}
            </figure>
            <div class="card-body px-1 py-2">
              <div class="flex gap-2 items-center">
                <div class="">
                    <img src=${item.authors[0].profile_picture} class="w-10 h-10 rounded-full">
                </div>
                <div class="">
                    <h3 class="font-semibold text-lg">${item.title}</h3>
                    <div class="flex gap-2">
                        <p class="text-gray-400 flex-grow-0">${item.authors[0].profile_name}</p>
                        ${item.authors[0].verified ? '<img src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000" class="w-5 h-5">' : ''}
                    </div>
                    <h4 class='text-gray-400 font-medium'>${item.others.views} Views</h4>
                </div>
              </div>
              <div class="card-actions justify-center pt-2">
                <button class="btn btn-error h-10 min-h-0 font-semibold" onclick="loadDetails('${item.video_id}')">Details</button>
              </div>
            </div>
        `
        allVideos.appendChild(div)
    })
}



document.getElementById('search-bar').addEventListener('keyup', function(event) {
    loadVideos(event.target.value)
})






loadCategories()
loadVideos()