import React from 'react';
import Dropzone from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};
const p = {
  margin: '10px'
};

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.state = { files: [] };
  }

  updateFormValue(event) {
    const imageString = event.target.result;
    const encodedImage = imageString.replace(/^data:image\/[a-z]+;base64,/, '');
    this.props.input.onChange(encodedImage);
  }

  onDrop(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = this.updateFormValue;
    this.setState({
      files: files.map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }))
    });
  }

  onCancel() {
    this.setState({
      files: []
    });
  }

  renderThumbnail() {
    const { files } = this.state;
    const {
      input: { value }
    } = this.props;
    return (
      <aside style={thumbsContainer}>
        <div style={thumb}>
          <div style={thumbInner}>
            {(files[0] || value) && (
              <img
                src={
                  files[0] ? files[0].preview : `data:image/png;base64,${value}`
                }
                style={img}
                alt="product"
              />
            )}
          </div>
        </div>
      </aside>
    );
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            {...this.props.input}
            multiple={false}
            accept="image/*"
            onDrop={this.onDrop}
            onFileDialogCancel={this.onCancel}
          >
            <p style={p}>
              Try dropping some files here, or click to select files to upload.
            </p>
          </Dropzone>
        </div>
        {this.renderThumbnail()}
      </section>
    );
  }
}

export default ImageUpload;
