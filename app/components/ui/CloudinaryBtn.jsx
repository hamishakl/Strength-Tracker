import React from 'react';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.dataParentToChild
        }
    }
    showWidget = () => {
        const { data } = this.state;

        let widget = window.cloudinary.createUploadWidget({
            cloudName: `df7rg1mde`,
            uploadPreset: `koixzros`,
            folder: 'strength-tracker',
            tags: ['profile-picture'],
            public_id: `${data[0]}-dp-${data[1]}`,
            // uploadSignature: generateSignature 
        },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log(result.info.url);
                }
            });
        widget.open()
    }
    render() {
        return (
            <div>
                <button type='submit' onClick={this.showWidget}> Upload Image </button>
            </div>
        );
    }
}
export default ImageUpload;