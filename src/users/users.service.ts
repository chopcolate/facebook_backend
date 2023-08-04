import { Inject, Injectable, UnauthorizedException, BadRequestException, forwardRef } from '@nestjs/common';
import { cloudinaryService } from '../common/cloudinary/cloudinary.service';
import { Model, Types } from 'mongoose'
import { IUser } from './interfaces/users.interface';
import { IPost } from './interfaces/posts.interface';
import CONSTANT from 'src/common/constants/constants';
import * as _ from 'lodash';
@Injectable()
export class UsersService {
    constructor(
        @Inject(CONSTANT.USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
        @Inject(CONSTANT.POST_MODEL_TOKEN) private readonly postModel: Model<IPost>,
        private readonly cloudinaryService: cloudinaryService,
    ) {}
    
    async init(username) {
        const user = await this.userModel.findOne({ username: username }).lean();
        let posts: any = await this.postModel.find({ author: { $in: [...user.contacts, username] }}).lean().sort({ time: -1 });
        posts = await posts.map(async (post) => {
                const comments = await post.comments.map(async (comment: any) => {
                    const userCmt: any = await this.userModel.findOne( {username: comment.username}, {avatar: 1, name: 1, _id: 0} ).lean();
                    return {
                        ...userCmt,
                        ...comment
                    }
                })
                await Promise.all(comments).then(res => post.comments = res);
                if (post.loves && post.loves.includes(username)) {
                    post.loved = true;
                }
                return {
                    ...post,
                    name: user["name"],
                    avatar: user["avatar"],
                }
            })
        posts = await Promise.all(posts)
        .then(posts => posts);
        return posts;
    }

    async getUserByUsername(username) {
        const user: any = await this.userModel.findOne({ username: username }, { password: 0 }).lean();
        let posts: any = await this.postModel.find({ author: username}).lean().sort({ time: -1 });
        posts = await posts.map(async (post) => {
                const comments = await post.comments.map(async (comment: any) => {
                    const userCmt: any = await this.userModel.findOne( {username: comment.username}, {avatar: 1, name: 1, _id: 0} ).lean();
                    return {
                        ...userCmt,
                        ...comment
                    }
                })
                await Promise.all(comments).then(res => post.comments = res);
                if (post.loves && post.loves.includes(username)) {
                    post.loved = true;
                }
                return {
                    ...post,
                    name: user["name"],
                    avatar: user["avatar"],
                }
            })
        posts = await Promise.all(posts)
                            .then(posts => posts);
        return {
            ...user,
            posts
        }
    }

    async getUserInfo(username) {
        return await this.userModel.findOne({ username: username });
    }

    async getContactsInfo(username) {
        const user = await this.userModel.findOne( { username: username });
        if (!user) {
            throw new UnauthorizedException();
        }
        const contacts = await this.userModel.find({ username: { $in: user.contacts } }, { password: 0, contacts: 0 }).lean();
        contacts.forEach(contact => {
            contact["online"] = false;
        });
        return contacts;
    }

    async getRequestsInfo(username) {
        const user = await this.userModel.findOne( { username: username }).lean();
        if (!user) {
            throw new UnauthorizedException();
        }
        const requests = await this.userModel.find({ username: { $in: user.requests } }).lean();
        requests.forEach(contact => {
            delete contact.password;
            delete contact.contacts;
        });
        return requests;
    }

    async getRequestList(username) {
        let requests =  await this.userModel.findOne({ username: username });
        return requests.requests;
    }

    async getNotiList(username) {
        let noti =  await this.userModel.findOne({ username: username });
        return noti.notifications;
    }

    async createPost(file: any, data: any) {
        const res: any = file ? await this.cloudinaryService.uploadImage(file) : null;
        const post = {
                    author: data.author,
                    time: data.time,
                    content: {
                                text: data.text,
                                img: res ? res.url : null
                            }
            
                    }
        await this.postModel.create(post);
        const user_contacts: any = await this.userModel.findOne( { username: data.author }, { contacts: 1 } )
        user_contacts.contacts.forEach(async (contact) => {
            await this.userModel.findOneAndUpdate( { username: contact }, { $push: { notifications: `${data.author} has created a new post` } } )
        })
    }

    async update(username: string,  avatar: any = null, data: any) {
        const user = await this.userModel.findOne({ username: username, password: data.password });
        if (!user) {
            await this.userModel.findOneAndUpdate({ username: username }, { $push: { notifications: 'Wrong Password !!!' } });
            throw new BadRequestException();
        }
        data.password = data.newPassword != "" ? data.newPassword : data.password;
        delete data.newPassword;
        if (!avatar) {
            data = {
                ...data,
                username: user.username,
                contacts: user.contacts,
                avatar: user.avatar,
            }
        }
        else {
            const res: any = await this.cloudinaryService.uploadImage(avatar);
            data = {
                ...data,
                username: user.username,
                contacts: user.contacts,
                avatar: res.url,
            }
        }
        await this.userModel.findOneAndUpdate( {username: username}, data );
        return "success";
    }

    async search(keyword: string) {
        return await this.userModel.find( { $or: [ { username: { $regex: new RegExp(`${keyword}`), $options: "i" } }, { name: { $regex: new RegExp(`${keyword}`), $options: "i" } } ] } )
    }

    async follow(username, partnername) {
        const user: any = await this.userModel.findOne( { username: username } );
        const partner: any = await this.userModel.findOne( { username: partnername } );
        if ( user && partner ) {
            if (user.contacts.includes(partnername)) {
                user.contacts = _.pull(user.contacts, partnername);
            }
            else if (user.requests.includes(partnername)) {
                user.contacts.push(partnername);
                partner.contacts.push(username);
                user.requests = _.pull(user.requests, partnername);
            }
            else {
                partner.requests.push(username);
            }
        }
        await this.userModel.findOneAndUpdate({username: username}, {contacts: user.contacts, requests: user.requests});
        await this.userModel.findOneAndUpdate({username: partnername}, {contacts: partner.contacts, requests: partner.requests});
    }

    async comment(user, data) {
        const post: any = await this.postModel.findOne({ _id: data.postId });
        if (post) {
            post.comments.push({
                username: user.username,
                content: data.comment,
            });
            await this.postModel.findOneAndUpdate({ _id: data.postId }, { comments: post.comments });
            return "success";
        }
        else {
            throw new BadRequestException();
        }
    }

    async lovePost(user, data) {
        if (data.loved === true) {
            return await this.postModel.findOneAndUpdate({ _id: data.postId }, { $push: { loves: user.username }});
        }
        return await this.postModel.findOneAndUpdate({ _id: data.postId }, { $pullAll: { loves: [user.username] }});
    }

}
