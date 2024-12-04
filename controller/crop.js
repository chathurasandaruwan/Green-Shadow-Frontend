$(document).ready(function () {
    $("#cropImgSelector").on("change", function (event) {
        event.preventDefault();
        const file = $("#cropImgSelector")[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#previewImage").attr("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    })
    $('#btnClear').on('click', () => {
        clearInputs();

    });
    function clearInputs() {
        let btnText = $("#btnClear").text()
        $('#commonNameTxt').val("");
        $('#scientificNameTxt').val("");
        $('#dropdownCategory').val("");
        $('#dropdownFieldName').val("");
        $('input[name="customRadioInline1"]').prop('checked', false);
        $('#cropImgSelector').val('');
        $('#previewImage').attr("src", "");
        if (btnText === "Cancel") {
            $("#btnClear").text("Clear");
            $("#btnSave").text("Save");
            $("#btnSave").removeClass("btn-warning");
            $("#btnSave").addClass("btn-primary");
        }
    }
    $('#btnSave').on('click', () => {
        let btnText = $("#btnSave").text()
        var commonName = $('#commonNameTxt').val();
        var scientificName = $('#scientificNameTxt').val();
        var category = $('#dropdownCategory').val();
        var fieldName = $('#dropdownFieldName').val();
        var season = $('input[name="customRadioInline1"]:checked').val();

        const fileInput = $('#cropImgSelector')[0]; // Access the DOM element
        const file = fileInput.files[0];

        // image encode to base64
        /*if (file) {
            const reader = new FileReader();

            // Callback for when the file is loaded
            reader.onload = function (e) {
                const base64String = e.target.result; // Get Base64 string
                console.log("Base64 String: ", base64String);
            };

            // Read the file as a data URL (Base64 encoded string)
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected");
        }*/
        //save data
        if (btnText === "Save") {
            $.ajax({
                method:"POST",
                contentType:"form-data",
                url:"http://localhost:8080/api/v1/customer",
                async:true,
                data:JSON.stringify({
                    "customerName": customerName,
                }),
                success:function (data){
                    console.log(commonName, scientificName, category, fieldName, season, file);
                    clearInputs();
                    iziToast.success({
                        title: 'Success!',
                        message: 'Crop has been Saved successfully..!',
                        position: 'bottomRight',
                        timeout: 5000,
                        progressBar: true,
                        class: 'custom-iziToast',
                    });
                },
                error:function (){
                    iziToast.error({
                        title: 'Error!',
                        message: 'Crop not saved ..!',
                        position: 'bottomRight',
                        timeout: 5000,
                        progressBar: true,
                        class: 'custom-iziToast',
                    });
                }
            })

        }else {
            //update data
            iziToast.show({
                title: 'Do you want to Update this crop?',
                message: 'Click the button below to confirm.',
                position: 'topCenter',
                class: 'custom-iziToast-btn',
                timeout: false, // Stays on screen until user interacts
                buttons: [
                    ['<button>Confirm</button>', function (instance, toast) {

                        if (!file){
                            console.log("No file selected");
                        }
                        $.ajax({
                            method:"POST",
                            contentType:"form-data",
                            url:"http://localhost:8080/api/v1/customer",
                            async:true,
                            data:JSON.stringify({
                                "customerName": customerName,

                            }),
                            success:function (data){
                                console.log(commonName, scientificName, category, fieldName, season, file);
                                clearInputs();
                                iziToast.success({
                                    title: 'Success!',
                                    message: 'Crop has been Updated successfully..!',
                                    position: 'bottomRight',
                                    timeout: 5000,
                                    progressBar: true,
                                    class: 'custom-iziToast',
                                });
                            },
                            error:function (){
                                iziToast.error({
                                    title: 'Error!',
                                    message: 'Crop not Updated ..!',
                                    position: 'bottomRight',
                                    timeout: 5000,
                                    progressBar: true,
                                    class: 'custom-iziToast',
                                });
                            }
                        })
                        instance.hide({ transitionOut: 'fadeOut' }, toast);
                    }],
                    ['<button>Cancel</button>', function (instance, toast) {
                        instance.hide({ transitionOut: 'fadeOut' }, toast);
                    }]
                ]
            });
        }
    });
    $("#cropTbl").on('click','tr',function (){
        let commonName = $(this).find("#commonNameValue").text();
        let scientificName = $(this).find("#scientificNameValue").text();
        let category = $(this).find("#categoryValue").text();
        let fieldName = $(this).find("#fieldNameValue").text();
        let season = $(this).find("#seasonValue").text();
        let img = $(this).find("#cropImgValue img").attr("src");
        console.log(commonName, scientificName, category, fieldName, season);
        console.log("image: ", img);

        $('#commonNameTxt').val(commonName);
        $('#scientificNameTxt').val(scientificName);
        $('#dropdownCategory').val(category);
        $('#dropdownFieldName').val(fieldName);
        // Set the appropriate radio button based on season
        $('input[name="customRadioInline1"]').each(function () {
            $(this).prop('checked', $(this).val() === season);
        });
        // Set the image source
        $('#previewImage').attr("src", img);

        $("#btnSave").text("Update");
        $("#btnSave").removeClass("btn-primary");
        $("#btnSave").addClass("btn-warning");
        $("#btnClear").text("Cancel");
    });
    //delete crop
    $("#cropTbl").on('click', '.deleteBtn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        iziToast.show({
            title: 'Do you want to delete this crop?',
            message: 'Click the button below to confirm.',
            position: 'topCenter',
            class: 'custom-iziToast-btn',
            timeout: false, // Stays on screen until user interacts
            buttons: [
                ['<button>Confirm</button>', function (instance, toast) {

                    $.ajax({
                        method:"POST",
                        contentType:"form-data",
                        url:"http://localhost:8080/api/v1/customer",
                        async:true,
                        data:JSON.stringify({
                            "customerName": customerName,
                        }),
                        success:function (data){
                            console.log("delete btn on action")
                            console.log("commonName: ", $(this).parent().parent().find("#commonNameValue").text());
                            iziToast.success({
                                title: 'Success!',
                                message: 'Crop has been Deleted successfully..!',
                                position: 'bottomRight',
                                timeout: 5000,
                                progressBar: true,
                                class: 'custom-iziToast',
                            });
                        },
                        error:function (){
                            iziToast.error({
                                title: 'Error!',
                                message: 'Crop not Deleted ..!',
                                position: 'bottomRight',
                                timeout: 5000,
                                progressBar: true,
                                class: 'custom-iziToast',
                            });
                        }
                    })

                    instance.hide({ transitionOut: 'fadeOut' }, toast);
                }],
                ['<button>Cancel</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast);
                }]
            ]
        });

    })
});
