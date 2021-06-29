let $noteName = $(".note-name");
let $noteText = $(".note-textarea");
let $saveBtn = $(".save-note");
let $newBtn = $(".new-note");
let $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the text area.
let activeNote = {};

// function gets notes from the db.
let getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "GET"
    });
};

// a function for saving a note to db
let saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};

// a function for deleting a note from db.
let deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};

// if note is active, it will display, else render empty.
let renderActiveNote = () => {
    $saveBtn.hide();

    if (activeNote.id) {
        $noteName.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteName.val(activeNote.name);
        $noteText.val(activeNote.text);
    } else {
        $noteName.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteName.val("");
        $noteText.val("");
    }
};

// get note data from user inputs, and save to db, and update view.
let handleNoteSave = () => {
    let newNote = {
        name: $noteName.val(),
        text: $noteText.val()
    };

    saveNote(newNote).then((data) => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// delete a note on click
let handleNoteDelete = (event) => {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();
    
    let note = $(this)
        .parent("list-group-item")
        .data();
    
    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// sets activeNote and displays it
let handleNoteView = () => {
    activeNote = $(this).data();
    renderActiveNote();
};

// sets the activeNote to an empty object and allows user to enter new note
let handeNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
};

// if note's name or text are empty, hide the save button, else show it
let handleRenderSaveBtn = () => {
    if (!$noteName.val().trim() || !$noteText.val().trim()) {
        $saveBtn.hide();
    } else {
        $saveBtn.show();
    }
};

// Render the list of note names
let renderNoteList = (notes) => {
    $noteList.empty();

    let noteListItems = [];

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let $li = $("<li class='list-group-item'>").data(note);
        let $span = $("<span>").text(note.title);
        let $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");

        $li.append($span, $delBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};

// gets notes from the db and renders these to sidebar
let getAndRenderNotes = () => {
    return getNotes().then((data) => {
        renderNoteList(data);
    });
}

$saveBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handeNewNoteView);
$noteList.on("keyup", handleRenderSaveBtn);
$noteName.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// gets and renders the initial list of notes
getAndRenderNotes();