import React from 'react'
import axios from 'axios'
import Iframe from 'react-iframe'
import { Segment, Card, Icon, Button, Comment, Header, Form } from 'semantic-ui-react'

class VideoShow extends React.Component {
    state = {
        comments: [
            { author: "A Guy", body: "Super cool app" },
            { author: "Another Guy", body: "Meh" },
            { author: "Frank", body: "Love it!" }
        ],
        video: {},
        likes: 220,
        dislikes: 0,
        author: "",
        body: "",
        editing: false
    };

    componentDidMount() {
        axios
            .get(`/api/videos/${this.props.match.params.id}`)
            .then(res => {
                this.setState({ video: res.data });
            })
            .catch(err => console.log(err));
    }

    handleEdit = (comment) => {
        this.setState({ author: comment.author, body: comment.body, editing: !this.state.editing })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { author, body, comments } = this.state
        axios.post(`/api/videos/${this.props.match.params.id}/comments`, { author, body })
            .then(({ data }) => {
                this.setState({ comments: [data, ...comments], author: '', body: '' })
            })
    }

    deleteComment = (id) => {
        axios.delete(`/api/videos/${this.props.match.params.id}/comments/${id}`)
            .then(res => {
                const comments = this.state.comments.filter(c => {
                    if (c.id !== id)
                        return c;
                })
                this.setState({ comments, });
            })
    }

    handleLike = (e) => {
        this.setState({ likes: this.state.likes + 1 })
    }
    handleDislike = (e) => {
        this.setState({ dislikes: this.state.dislikes + 1 })
    }

    render() {
        const { author, body, video } = this.state;
        return (
            <>
                <Segment style={{ height: "500px" }}>
                    <Iframe
                        width="100%"
                        height="100%"
                        id="myId"
                        title="youtube video"
                        url={video.url}
                        fluid
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowFullScreen
                    />
                </Segment>
                <Card fluid>
                    <Card.Header textAlign='center'>{this.state.video.title}</Card.Header>
                    <Card.Header textAlign='center'>
                        <div>
                            <Icon name='thumbs up' onClick={this.handleLike} />
                            {this.state.likes}
                        </div>
                        <div>
                            <Icon name='thumbs down' onClick={this.handleDislike} />
                            {this.state.dislikes}
                        </div>
                    </Card.Header>
                    <Card.Meta textAlign='center'>{this.state.video.genre}</Card.Meta>
                    <Card.Content textAlign='center'>{this.state.video.description}</Card.Content>
                </Card>
                <Comment.Group>
                    <Header as='h3' dividing>
                        Comments
                    </Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Input
                                name='author'
                                value={author}
                                autoFocus
                                label='Author'
                                placeholder='Author'
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                name='body'
                                value={body}
                                type='text'
                                autoFocus
                                label='Body'
                                placeholder='Body'
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Button type='submit'>Submit</Form.Button>
                    </Form>
                    {this.state.comments.map(comment => (
                        <Comment>
                            <Comment.Avatar src={require('../images/user.png')} />
                            <Comment.Content>
                                <Comment.Author>{comment.author}</Comment.Author>
                                <Comment.Metadata>
                                    <div>Today at {comment.created_at}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                            <Button.Group>
                                <Button size='tiny' color='red' onClick={() => this.deleteComment(comment.id)}>
                                    <Icon name='trash' />
                                </Button>
                                <Button.Or />
                                <Button size='tiny' color='blue' onClick={() => this.handleEdit(comment)}>
                                    <Icon name='pencil' />
                                </Button>
                            </Button.Group>
                        </Comment>
                    ))}
                </Comment.Group>
            </>
        )
    }
}

export default VideoShow;
