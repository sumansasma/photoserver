// Fetch and display uploaded photos
function fetchPhotos() {
    fetch('/photos')
        .then(response => response.json())
        .then(data => {
            const photoList = document.getElementById('photoList');
            photoList.innerHTML = '';

            data.forEach(photo => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="uploads/${photo.filename}" alt="Uploaded Photo">
                    <button onclick="deletePhoto(${photo.id})">Delete</button>
                `;
                photoList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching photos:', error);
        });
}

// Delete a photo by its ID
function deletePhoto(id) {
    fetch(`/photo/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.status === 204) {
                fetchPhotos();
            } else {
                console.error('Error deleting photo:', response.status);
            }
        })
        .catch(error => {
            console.error('Error deleting photo:', error);
        });
}

// Fetch and display photos when the page loads
fetchPhotos();

