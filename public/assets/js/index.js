let $noteName = $(".note-name");
let $noteText = $(".note-textarea");
let $saveBtn = $(".save-note");
let $newBtn = $(".new-note");
let $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the text area.
let activeNote = {};

// function gets notes from the db.
let getNotes = function() {
    return $.ajax({
        url: "/api/notes",
        method: "GET"
    });
};

// a function for saving a note to db
let saveNote = function (note) {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};

// a function for deleting a note from db.
let deleteNote = function (id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};

// if note is active, it will display, else render empty.
let renderActiveNote = function () {
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
let handleNoteSave = function () {
    let newNote = {
        name: $noteName.val(),
        text: $noteText.val()
    };

    saveNote(newNote).then(function (data) {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// delete a note on click
let handleNoteDelete = function (event) {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();
    
    let note = $(this)
        .parent(".list-group-item")
        .data();
    
    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then( function () {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// sets activeNote and displays it
let handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
};

// sets the activeNote to an empty object and allows user to enter new note
let handeNewNoteView = function () {
    activeNote = {};
    renderActiveNote();
};

// if note's name or text are empty, hide the save button, else show it
let handleRenderSaveBtn = function () {
    if (!$noteName.val().trim() || !$noteText.val().trim()) {
        $saveBtn.hide();
    } else {
        $saveBtn.show();
    }
};

// Render the list of note names
let renderNoteList = function (notes) {
    $noteList.empty();

    let noteListItems = [];

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let $li = $("<li class='list-group-item'>").data(note);
        let $span = $("<span>").text(note.name);
        let $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");

        $li.append($span, $delBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};

// gets notes from the db and renders these to sidebar
let getAndRenderNotes = function () {
    return getNotes().then( function (data) {
        renderNoteList(data);
    });
};

$saveBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newBtn.on("click", handeNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteName.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// gets and renders the initial list of notes
getAndRenderNotes();