import Button from '@app/components/Common/Button';
import LoadingSpinner from '@app/components/Common/LoadingSpinner';
import PageTitle from '@app/components/Common/PageTitle';
import globalMessages from '@app/i18n/globalMessages';
import { SaveIcon } from '@heroicons/react/outline';
import { Networks } from '@server/constants/networks';
import type { NetworkSettings } from '@server/lib/settings';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import { defineMessages, useIntl } from 'react-intl';
import { useToasts } from 'react-toast-notifications';
import useSWR, { mutate } from 'swr';

const messages = defineMessages({
  networks: 'Networks',
  networkSettings: 'Network Settings',
  networkSettingsDescription: 'Configure available Networks.',
  toastSettingsSuccess: 'Network settings saved successfully!',
  toastSettingsFailure: 'Something went wrong while saving settings.',
  disableRequestsForAvailableNetworks:
    'Disable requests for media on available networks',
  disableRequestsForAvailableNetworksTip:
    'Do not allow requests to be made for Movies and TV Shows which are currently available on your networks',
  availableNetworks: 'Available Networks',
  availableNetworksTip: 'Select all Networks which you are subscribed to',
});

const SettingsUsers = () => {
  const { addToast } = useToasts();
  const intl = useIntl();
  const {
    data,
    error,
    mutate: revalidate,
  } = useSWR<NetworkSettings>('/api/v1/settings/networks');

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle
        title={[
          intl.formatMessage(messages.networks),
          intl.formatMessage(globalMessages.settings),
        ]}
      />
      <div className="mb-6">
        <h3 className="heading">
          {intl.formatMessage(messages.networkSettings)}
        </h3>
        <p className="description">
          {intl.formatMessage(messages.networkSettingsDescription)}
        </p>
      </div>
      <div className="section">
        <Formik
          initialValues={{
            disableRequestsForAvailableNetworks:
              data?.disableRequestsForAvailableNetworks,
            available: data?.available || {
              netflix: false,
              primeVideo: false,
              appleTv: false,
              disneyPlus: false,
              hulu: false,
              hbo: false,
            },
          }}
          enableReinitialize
          onSubmit={async (values) => {
            try {
              await axios.post('/api/v1/settings/networks', {
                disableRequestsForAvailableNetworks:
                  values.disableRequestsForAvailableNetworks,
                available: values.available,
              });
              mutate('/api/v1/settings/public');

              addToast(intl.formatMessage(messages.toastSettingsSuccess), {
                autoDismiss: true,
                appearance: 'success',
              });
            } catch (e) {
              addToast(intl.formatMessage(messages.toastSettingsFailure), {
                autoDismiss: true,
                appearance: 'error',
              });
            } finally {
              revalidate();
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            return (
              <Form className="section">
                <div className="form-row">
                  <label
                    htmlFor="disableRequestsForAvailableNetworks"
                    className="checkbox-label"
                  >
                    {intl.formatMessage(
                      messages.disableRequestsForAvailableNetworks
                    )}
                    <span className="label-tip">
                      {intl.formatMessage(
                        messages.disableRequestsForAvailableNetworksTip
                      )}
                    </span>
                  </label>
                  <div className="form-input-area">
                    <Field
                      type="checkbox"
                      id="disableRequestsForAvailableNetworks"
                      name="disableRequestsForAvailableNetworks"
                      onChange={() => {
                        setFieldValue(
                          'disableRequestsForAvailableNetworks',
                          !values.disableRequestsForAvailableNetworks
                        );
                      }}
                    />
                  </div>
                </div>
                <div
                  role="group"
                  aria-labelledby="group-label"
                  className="form-group"
                >
                  <div className="form-row">
                    <span id="group-label" className="group-label">
                      {intl.formatMessage(messages.availableNetworks)}
                      <span className="label-tip">
                        {intl.formatMessage(messages.availableNetworksTip)}
                      </span>
                    </span>
                    <div className="form-input-area">
                      <div className="max-w-lg">
                        {Object.entries(Networks).map(
                          ([networkId, network], index) => (
                            <div
                              key={index}
                              className="relative mt-4 flex items-start first:mt-0"
                            >
                              <div className="flex h-6 items-center">
                                <Field
                                  type="checkbox"
                                  id={`available.${networkId}`}
                                  name={`available.${networkId}`}
                                  onChange={() => {
                                    setFieldValue(
                                      `available.${networkId}`,
                                      !values.available[
                                        networkId as keyof typeof Networks
                                      ]
                                    );
                                  }}
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label
                                  htmlFor={`available.${networkId}`}
                                  className="block"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-white">
                                      {network.displayName}
                                    </span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <div className="flex justify-end">
                    <span className="ml-3 inline-flex rounded-md shadow-sm">
                      <Button
                        buttonType="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <SaveIcon />
                        <span>
                          {isSubmitting
                            ? intl.formatMessage(globalMessages.saving)
                            : intl.formatMessage(globalMessages.save)}
                        </span>
                      </Button>
                    </span>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default SettingsUsers;
