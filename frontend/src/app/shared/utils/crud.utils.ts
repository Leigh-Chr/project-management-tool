import { Injector, effect, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { ToastService } from '../components/toast/toast.service';

/**
 * Utilitaire pour simplifier les opérations CRUD avec gestion d'état automatique
 */
export class CrudUtils {
  /**
   * Crée un signal réactif pour une opération CRUD avec gestion d'erreurs
   * @param operation Observable de l'opération API
   * @param injector Injector Angular pour le contexte d'exécution
   * @param onSuccess Callback appelé en cas de succès
   * @param onError Callback optionnel appelé en cas d'erreur
   * @returns Observable de l'opération avec gestion d'état
   */
  static createCrudOperation<TResponse>(
    operation: Observable<TResponse>,
    injector: Injector,
    onSuccess: (result: TResponse) => void,
    onError?: (error: unknown) => void
  ): Observable<TResponse> {
    
    const resultSignal = toSignal(operation, { injector });
    
    runInInjectionContext(injector, () => {
      effect(() => {
        const result = resultSignal();
        
        if (result) {
          onSuccess(result);
        }
      });
    });

    return operation.pipe(
      catchError(error => {
        if (onError) {
          onError(error);
        }
        return of(undefined as TResponse);
      })
    );
  }

  /**
   * Crée un signal réactif pour une opération de suppression
   * @param deleteOperation Observable de l'opération de suppression
   * @param injector Injector Angular
   * @param onSuccess Callback avec l'ID de l'élément supprimé
   * @param toastService Service pour afficher les notifications
   * @returns Observable de l'opération
   */
  static createDeleteOperation<TResponse extends { id: number }>(
    deleteOperation: Observable<TResponse>,
    injector: Injector,
    onSuccess: (id: number) => void,
    toastService?: ToastService
  ): Observable<TResponse> {
    return this.createCrudOperation(
      deleteOperation,
      injector,
      (result) => onSuccess(result.id),
      (_error) => {
        if (toastService) {
          toastService.showToast({
            title: 'Error',
            message: 'Delete operation failed',
            type: 'error'
          });
        }
      }
    );
  }

  /**
   * Crée un signal réactif pour une opération de création
   * @param createOperation Observable de l'opération de création
   * @param injector Injector Angular
   * @param onSuccess Callback avec l'élément créé
   * @param toastService Service pour afficher les notifications
   * @returns Observable de l'opération
   */
  static createPostOperation<TResponse>(
    createOperation: Observable<TResponse>,
    injector: Injector,
    onSuccess: (result: TResponse) => void,
    toastService?: ToastService
  ): Observable<TResponse> {
    return this.createCrudOperation(
      createOperation,
      injector,
      onSuccess,
      (_error) => {
        if (toastService) {
          toastService.showToast({
            title: 'Error',
            message: 'Create operation failed',
            type: 'error'
          });
        }
      }
    );
  }

  /**
   * Crée un signal réactif pour une opération de mise à jour
   * @param updateOperation Observable de l'opération de mise à jour
   * @param injector Injector Angular
   * @param onSuccess Callback avec l'élément mis à jour
   * @param toastService Service pour afficher les notifications
   * @returns Observable de l'opération
   */
  static createPatchOperation<TResponse>(
    updateOperation: Observable<TResponse>,
    injector: Injector,
    onSuccess: (result: TResponse) => void,
    toastService?: ToastService
  ): Observable<TResponse> {
    return this.createCrudOperation(
      updateOperation,
      injector,
      onSuccess,
      (_error) => {
        if (toastService) {
          toastService.showToast({
            title: 'Error',
            message: 'Update operation failed',
            type: 'error'
          });
        }
      }
    );
  }
}
