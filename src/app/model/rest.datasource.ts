import { Injectable } from "@angular/core";
import { HttpClient, 
    HttpRequest, 
    HttpEventType, 
    HttpEvent, 
    HttpResponse, 
    HttpHeaders,
    } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Product } from "./product.model";
import { Cart } from "./cart.model";
import { Order } from "./order.model";
import { tap, filter, map } from 'rxjs/operators';

const PROTOCOL = "http";
const PORT = 3500;

@Injectable()
export class RestDataSource {
    baseUrl: string;
    auth_token: string;

    constructor(private http: HttpClient) {
        this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
    }
    
    // getProducts(): Observable<Product[]> {
    //     return this.http.get<Product[]>( this.baseUrl+ "products");
    // }

    // saveOrder(order: Order): Observable<Order> {
    //     return this.http.post<Order>(this.baseUrl + "orders", order);
    // }

    // private sendRequest(verb: string,
    //     url: string, body?: Product | Order): Observable<any> {
    //     return this.http.request(new HttpRequest(
    //         verb,
    //         this.baseUrl + url,
    //         body
    //     ));
    // }

    authenticate(user: string, pass: string): Observable<boolean> {
        return this.http.post<LoginResponse>(this.baseUrl + "login", { name: user, password: pass },
        ).map(response => {
                let r = response;
                this.auth_token = r.success ? r.token : null;
                return r.success;
        });
    }

    getProducts(): Observable<any> {
        return this.sendRequest('GET', "products");
    }
    
    saveProduct(product: Product): Observable<Product> {
        return this.sendRequest('POST', "products",
            product, true);
    }

    updateProduct(product): Observable<Product> {
        return this.sendRequest('PUT',
            `products/${product.id}`, product, true);
    }

    deleteProduct(id: number): Observable<Product> {
        return this.sendRequest('DELETE',
            `products/${id}`, null, true);
    }

    getOrders(): Observable<Order[]> {
        return this.sendRequest('GET',
            "orders", null, true);
    }

    deleteOrder(id: number): Observable<Order> {
        return this.sendRequest('DELETE',
            `orders/${id}`, null, true);
    }

    updateOrder(order: Order): Observable<Order> {
        return this.sendRequest('PUT',
            `orders/${order.id}`, order, true);
    }

    saveOrder(order: Order): Observable<any> {
        return this.sendRequest('POST', "orders", order);
    }

    private sendRequest(verb: string, url: string, body?: Product | Order, auth: boolean = false)
        : Observable<any> {

        let headers = new HttpHeaders();

        if (auth && this.auth_token != null) {
            headers = headers.set("Authorization", `Bearer<${this.auth_token}>`);
        }

        let options = { 

        }

        let request = new HttpRequest(
            verb,
            this.baseUrl + url,
            body,
            {
                headers: headers,
                responseType: 'json'
            }
        );

        return this.http.request(request)
                .pipe(
                    filter(event => event.type === HttpEventType.Response),
                    map((response: HttpResponse<any>) => response.body)
                )
                
    }
        
    
    
}

class LoginResponse {
    success: boolean;
    token: null;
}