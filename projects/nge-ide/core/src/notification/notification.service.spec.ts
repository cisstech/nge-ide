import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NgEventBus } from 'ng-event-bus';
import { ErrorNotification } from './notification';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NgEventBus,
                NotificationService,
            ],
        });
    });

    it('should be created', inject([NotificationService], (service: NotificationService) => {
        expect(service).toBeTruthy();
    }));

    it('should count', waitForAsync(
        inject([NotificationService], (service: NotificationService) => {
            service.publish(new ErrorNotification('message', 'error'));
            service.count.toPromise().then((count) => {
                expect(count).toBe(1);
            });
        })
    ));

    it('should be destroyed', inject([NotificationService], (service: NotificationService) => {
        service.ngOnDestroy();
        expect().nothing();
    }));

    it('should clear', waitForAsync(inject([NotificationService], async (service: NotificationService) => {
        service.clear();
        service.count.toPromise().then((count) => {
            expect(count).toBe(0);
        });
    })));
});
